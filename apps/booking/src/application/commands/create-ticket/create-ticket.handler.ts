import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTicketCommand } from "./create-ticket.command";
import { TicketFactory } from "../../../domain/factories/ticket.factory";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { TicketUpdatedEvent } from "@app/shared-kernel/application/events/ticket-updated.event";

@CommandHandler(CreateTicketCommand)
export class CreateTicketHandler implements ICommandHandler<CreateTicketCommand> {
    constructor(
        private readonly ticketFactory: TicketFactory,

        private readonly amqpConnection: AmqpConnection
    ) {}

    public async execute({ sessionId, seatId, userId, hallId }: CreateTicketCommand): Promise<void> {
        const ticket = await this.ticketFactory.create({ sessionId, seatId, userId, hallId });

        this.amqpConnection.publish(
            "domain_events",
            "ticket.updated",
            new TicketUpdatedEvent(ticket.userId, ticket.sessionId, ticket.seatId, "booked")
        );
    }
}
