import { Injectable } from "@nestjs/common";
import { Ticket, TicketStatus } from "src/domain/ticket/models/ticket.entity";
import { TypeOrmMapper } from "src/infrastructure/common/interfaces/typeorm-mapper.i";
import { TypeOrmTicket } from "../entities/typeorm-ticket.entity";

@Injectable()
export class TypeOrmTicketMapper implements TypeOrmMapper<Ticket, TypeOrmTicket> {
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