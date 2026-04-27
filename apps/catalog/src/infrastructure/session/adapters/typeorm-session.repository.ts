import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmSession } from "../entities/typeorm-session.entity";
import { TypeOrmSessionMapper } from "../mappers/typeorm-session.mapper";
import { Injectable } from "@nestjs/common";
import { SessionRepository } from "@app/catalog/domain/session/ports/session.repository";
import { Session } from "@app/catalog/domain/session/models/session.entity";

@Injectable()
export class TypeOrmSessionRepository implements SessionRepository {
    constructor(
        @InjectRepository(TypeOrmSession)
        private readonly sessionRepo: Repository<TypeOrmSession>,

        private readonly sessionMapper: TypeOrmSessionMapper
    ) {}

    public async findById(id: string): Promise<Session | null> {
        const sessionOrm = await this.sessionRepo.findOne({ where: { id } });
        if (!sessionOrm) return null;

        const sessionDomain = this.sessionMapper.toDomain(sessionOrm);
        return sessionDomain;
    }

    public async findByHall(hallId: string): Promise<Session[]> {
        const sessionsOrm = await this.sessionRepo.find({ where: { hallId } });

        const sessionsDomain = sessionsOrm.map((item) => this.sessionMapper.toDomain(item));
        return sessionsDomain;
    }

    public async save(session: Session): Promise<void> {
        const sessionOrm = this.sessionMapper.toOrm(session);

        await this.sessionRepo.save(sessionOrm);
    }

    public async delete(session: Session): Promise<void> {
        const sessionOrm = this.sessionMapper.toOrm(session);

        await this.sessionRepo.remove(sessionOrm);
    }
}
