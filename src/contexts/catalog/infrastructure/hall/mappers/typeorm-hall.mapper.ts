import { Injectable } from "@nestjs/common";
import { TypeOrmHall } from "../entities/typeorm-hall.entity";
import { TypeOrmSeat } from "../entities/typeorm-seat.entity";
import { EntityMapper } from "src/common/interfaces/entity-mapper";
import { Hall, SeatInfoType } from "src/contexts/catalog/domain/hall/models/hall.entity";

@Injectable()
export class TypeOrmHallMapper implements EntityMapper<Hall, TypeOrmHall> {
    public toDomain(ormEntity: TypeOrmHall): Hall {
        const seatsInfo: SeatInfoType[] = (ormEntity.seats ?? []).map((seat) => ({
            row: seat.rowNumber,
            column: seat.columnNumber,
            id: seat.id
        }));

        const domainHall = new Hall(ormEntity.name, ormEntity.type, seatsInfo, ormEntity.id);
        return domainHall;
    }

    public toOrm(domainEntity: Hall): TypeOrmHall {
        const ormHall = new TypeOrmHall();

        ormHall.id = domainEntity.id;
        ormHall.name = domainEntity.name;
        ormHall.type = domainEntity.type;

        ormHall.seats = domainEntity.seats.map((seat) => {
            const ormSeat = new TypeOrmSeat();

            ormSeat.id = seat.id;
            ormSeat.rowNumber = seat.row;
            ormSeat.columnNumber = seat.column;
            ormSeat.hallId = domainEntity.id;

            return ormSeat;
        });

        return ormHall;
    }
}
