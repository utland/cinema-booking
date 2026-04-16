import { Body, Controller, Delete, Param, Patch, Post, ParseUUIDPipe } from "@nestjs/common";
import { CreateTicketReqDto } from "./dtos/create-ticket.request.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser } from "src/common/presentation/decorators/current-user.decorator";
import { type Payload } from "src/common/interfaces/payload.i";
import { CreateTicketCommand } from "../application/commands/create-ticket/create-ticket.command";
import { CancelTicketCommand } from "../application/commands/cancel-ticket/cancel-ticket.command";
import { PayTicketCommand } from "../application/commands/pay-ticket/pay-ticket.command";
import { DeleteTicketCommand } from "../application/commands/delete-ticket/delete-ticket.command";
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiBody,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiUnauthorizedResponse({ description: "Authentication credentials were missing or invalid" })
@ApiTags("Booking")
@ApiBearerAuth()
@Controller("ticket")
export class TicketController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    @ApiOperation({ summary: "Create a ticket for a session" })
    @ApiCreatedResponse({ description: "Ticket created successfully" })
    @ApiBadRequestResponse({ description: "Invalid ticket request data" })
    @ApiNotFoundResponse({ description: "Session, hall, or seat not found" })
    @ApiConflictResponse({ description: "Ticket cannot be created due to seat reservation or time constraints" })
    public async create(@Body() createTicketDto: CreateTicketReqDto, @CurrentUser() user: Payload): Promise<void> {
        const { sessionId, seatId, hallId } = createTicketDto;
        await this.commandBus.execute(new CreateTicketCommand(sessionId, seatId, user.id, hallId));
    }

    @Patch("/cancel/:id")
    @ApiOperation({ summary: "Cancel an existing ticket" })
    @ApiOkResponse({ description: "Ticket cancelled successfully" })
    @ApiNotFoundResponse({ description: "Ticket not found" })
    @ApiForbiddenResponse({ description: "User is not allowed to cancel this ticket" })
    @ApiBadRequestResponse({ description: "Invalid ticket cancel request" })
    public async cancelTicket(@Param("id", new ParseUUIDPipe()) ticketId: string, @CurrentUser() user: Payload): Promise<void> {
        await this.commandBus.execute(new CancelTicketCommand(ticketId, user.id));
    }

    @Patch("/pay/:id")
    @ApiOperation({ summary: "Pay for a ticket" })
    @ApiOkResponse({ description: "Ticket payment completed successfully" })
    @ApiNotFoundResponse({ description: "Ticket not found" })
    @ApiConflictResponse({ description: "Payment failed or is invalid" })
    @ApiForbiddenResponse({ description: "User is not allowed to pay for this ticket" })
    @ApiInternalServerErrorResponse({ description: "Payment provider error" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                token: { type: "string", example: "tok_test_123456" }
            },
            required: ["token"],
        },
    })
    public async payTicket(
        @Param("id", new ParseUUIDPipe()) ticketId: string,
        @Body("token") token: string,
        @CurrentUser() user: Payload
    ): Promise<void> {
        await this.commandBus.execute(new PayTicketCommand(ticketId, user.id, token));
    }

    @Delete("/:id")
    @ApiOperation({ summary: "Delete a ticket" })
    @ApiOkResponse({ description: "Ticket deleted successfully" })
    @ApiNotFoundResponse({ description: "Ticket not found" })
    @ApiForbiddenResponse({ description: "User is not allowed to delete this ticket" })
    public async remove(@Param("id", new ParseUUIDPipe()) ticketId: string, @CurrentUser() user: Payload): Promise<void> {
        await this.commandBus.execute(new DeleteTicketCommand(ticketId, user.id));
    }
}
