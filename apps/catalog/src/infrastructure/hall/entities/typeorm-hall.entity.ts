import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { TypeOrmSeat } from "./typeorm-seat.entity";
import { TypeOrmSession } from "../../session/entities/typeorm-session.entity";
import { HallType } from "@app/catalog/domain/hall/models/hall.entity";

@Entity("halls")
export class TypeOrmHall {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ type: "enum", enum: HallType, default: HallType.STANDART })
    type: HallType;

    @OneToMany(() => TypeOrmSeat, (seat) => seat.hall, { cascade: true })
    seats: TypeOrmSeat[];

    @OneToMany(() => TypeOrmSession, (session) => session.hall)
    sessions: TypeOrmSession[];
}
