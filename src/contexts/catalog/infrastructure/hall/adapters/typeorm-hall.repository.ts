import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmHall } from "../entities/typeorm-hall.entity";
import { Injectable } from "@nestjs/common";
import { TypeOrmHallMapper } from "../mappers/typeorm-hall.mapper";
import { TypeOrmSeat } from "../entities/typeorm-seat.entity";
import { HallRepository } from "src/contexts/catalog/domain/hall/ports/hall.repository";
import { Hall } from "src/contexts/catalog/domain/hall/models/hall.entity";

@Injectable()
export class TypeOrmHallRepository implements HallRepository {
    constructor(
        @InjectRepository(TypeOrmHall)
        private readonly hallRepo: Repository<TypeOrmHall>,

        private readonly dateSource: DataSource,

        private readonly hallMapper: TypeOrmHallMapper
    ) {}

    public async findById(id: string): Promise<Hall | null> {
        const hallOrm = await this.hallRepo.findOne({ where: { id }, relations: { seats: true } });
        if (!hallOrm) return null;

        const hallDomain = this.hallMapper.toDomain(hallOrm);
        return hallDomain;
    }

    public async findAll(): Promise<Hall[]> {
        const hallsOrm = await this.hallRepo.find({ relations: { seats: true } });

        const hallDomain = hallsOrm.map((item) => this.hallMapper.toDomain(item));
        return hallDomain;
    }

    public async save(hall: Hall): Promise<void> {
        await this.dateSource.transaction(async (manager) => {
            manager.delete(TypeOrmSeat, { hallId: hall.id });

            const hallOrm = this.hallMapper.toOrm(hall);
            await manager.save(TypeOrmHall, hallOrm);
        });
    }

    public async delete(hall: Hall): Promise<void> {
        const hallOrm = this.hallMapper.toOrm(hall);

        await this.hallRepo.remove(hallOrm);
    }
}
