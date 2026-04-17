import { Body, Controller, Delete, Param, Patch, Post, ParseUUIDPipe } from "@nestjs/common";
import { CreateTicketReqDto } from "./dtos/create-ticket.request.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser } from "src/common/presentation/decorators/current-user.decorator";
import { type Payload } from "src/common/interfaces/payload.i";
import { CreateTicketCommand } from "../application/commands/create-ticket/create-ticket.command";
import { CancelTicketCommand } from "../application/commands/cancel-ticket/cancel-ticket.command";
import { PayTicketCommand } from "../application/commands/pay-ticket/pay-ticket.command";
import { DeleteTicketCommand } from "../application/commands/delete-ticket/delete-ticket.command";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";

@ApiTags("Booking")
@ApiBearerAuth()
@Controller("ticket")
export class TicketController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    @ApiOperation({ summary: "Create a ticket for a session" })
    public async create(@Body() createTicketDto: CreateTicketReqDto, @CurrentUser() user: Payload): Promise<void> {
        const { sessionId, seatId, hallId } = createTicketDto;
        await this.commandBus.execute(new CreateTicketCommand(sessionId, seatId, user.id, hallId));
    }

    @Patch("/cancel/:id")
    @ApiOperation({ summary: "Cancel an existing ticket" })
    public async cancelTicket(
        @Param("id", new ParseUUIDPipe()) ticketId: string,
        @CurrentUser() user: Payload
    ): Promise<void> {
        await this.commandBus.execute(new CancelTicketCommand(ticketId, user.id));
    }

    @Patch("/pay/:id")
    @ApiOperation({ summary: "Pay for a ticket" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                token: { type: "string", example: "tok_test_123456" }
            },
            required: ["token"]
        }
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
    public async remove(
        @Param("id", new ParseUUIDPipe()) ticketId: string,
        @CurrentUser() user: Payload
    ): Promise<void> {
        await this.commandBus.execute(new DeleteTicketCommand(ticketId, user.id));
    }
}
