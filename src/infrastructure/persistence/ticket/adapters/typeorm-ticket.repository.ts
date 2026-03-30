import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TicketRepository } from "src/domain/ticket/ports/ticket.repository";
import { TypeOrmTicket } from "../entities/typeorm-ticket.entity";
import { Ticket } from "src/domain/ticket/models/ticket.entity";
import { TypeOrmTicketMapper } from "../mappers/typeorm-ticket.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
    constructor(
        @InjectRepository(TypeOrmTicket)
        private readonly ticketRepo: Repository<TypeOrmTicket>,

        private readonly ticketMapper: TypeOrmTicketMapper
    ) {}
    
    public async findById(id: string): Promise<Ticket | null> {
        const ticketOrm = await this.ticketRepo.findOne({ where: { id }});
        if (!ticketOrm) return null;

        const ticketDomain = this.ticketMapper.toDomain(ticketOrm);
        return ticketDomain;
    }

    public async findBySession(...sessionIds: string[]): Promise<Ticket[]> {
        const ticketsOrm = await this.ticketRepo.find({ where: { sessionId: In(sessionIds) } });

        const ticketsDomain = ticketsOrm.map(item => this.ticketMapper.toDomain(item));
        return ticketsDomain;
    }

    public async findBySeat(seatId: string, sessionId: string): Promise<Ticket[]> {
        const ticketsOrm = await this.ticketRepo.find({ where: { seatId, sessionId }});

        const ticketsDomain = ticketsOrm.map(item => this.ticketMapper.toDomain(item));
        return ticketsDomain;
    }

    public async findByUser(userId: string, sessionId: string): Promise<Ticket[]> {
        const ticketsOrm = await this.ticketRepo.find({ where: { userId, sessionId }});

        const ticketsDomain = ticketsOrm.map(item => this.ticketMapper.toDomain(item));
        return ticketsDomain;
    }

    public async save(ticket: Ticket): Promise<void> {
        const ticketOrm = this.ticketMapper.toOrm(ticket);

        await this.ticketRepo.save(ticketOrm);
    }

    public async delete(ticket: Ticket): Promise<void> {
        const ticketOrm = this.ticketMapper.toOrm(ticket);

        await this.ticketRepo.remove(ticketOrm);
    }
    
}