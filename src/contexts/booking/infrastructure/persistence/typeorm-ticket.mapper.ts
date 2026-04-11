import { Injectable } from "@nestjs/common";
import { TypeOrmTicket } from "./typeorm-ticket.entity";
import { EntityMapper } from "src/common/interfaces/entity-mapper";
import { Ticket } from "../../domain/models/ticket.entity";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";

@Injectable()
export class TypeOrmTicketMapper implements EntityMapper<Ticket, TypeOrmTicket> {
    toDomain(ormEntity: TypeOrmTicket): Ticket {
        return new Ticket(
            ormEntity.status as TicketStatus,
            ormEntity.price,
            ormEntity.sessionId,
            ormEntity.seatId,
            ormEntity.userId,
            ormEntity.id
        );
    }

    toOrm(domainEntity: Ticket): TypeOrmTicket {
        const ormTicket = new TypeOrmTicket();

        ormTicket.id = domainEntity.id;
        ormTicket.status = domainEntity.status;
        ormTicket.price = domainEntity.money.price;
        ormTicket.sessionId = domainEntity.sessionId;
        ormTicket.seatId = domainEntity.seatId;
        ormTicket.userId = domainEntity.userId;

        return ormTicket;
    }
}
