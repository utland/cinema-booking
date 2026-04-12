import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { HallType } from "src/domain/hall/models/hall.entity";
import { TypeOrmSeat } from "./typeorm-seat.entity";
import { TypeOrmSession } from "src/infrastructure/persistence/session/entities/typeorm-session.entity";

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
