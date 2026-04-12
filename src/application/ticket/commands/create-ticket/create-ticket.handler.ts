import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTicketCommand } from "./create-ticket.command";
import { TicketFactory } from "src/domain/ticket/factories/ticket.factory";

@CommandHandler(CreateTicketCommand)
export class CreateTicketHandler implements ICommandHandler<CreateTicketCommand> {
    constructor(private readonly ticketFactory: TicketFactory) {}

    public async execute({ sessionId, seatId, userId, hallId }: CreateTicketCommand): Promise<void> {
        await this.ticketFactory.create({ sessionId, seatId, userId, hallId });
    }
}
