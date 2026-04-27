import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTicketCommand } from "./create-ticket.command";
import { TicketFactory } from "../../../domain/factories/ticket.factory";

@CommandHandler(CreateTicketCommand)
export class CreateTicketHandler implements ICommandHandler<CreateTicketCommand> {
    constructor(private readonly ticketFactory: TicketFactory) {}

    public async execute({ sessionId, seatId, userId, hallId }: CreateTicketCommand): Promise<void> {
        await this.ticketFactory.create({ sessionId, seatId, userId, hallId });
    }
}
