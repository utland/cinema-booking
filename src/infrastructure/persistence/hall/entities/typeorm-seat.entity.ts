import { Entity, Column, OneToMany, Index, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { TypeOrmTicket } from "src/infrastructure/persistence/ticket/entities/typeorm-ticket.entity";
import { TypeOrmHall } from "./typeorm-hall.entity";

@Entity("seats")
@Index(["hall", "rowNumber", "columnNumber"], { unique: true })
export class TypeOrmSeat {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ name: "row_number" })
    rowNumber: number;

    @Column({ name: "column_number" })
    columnNumber: number;

    @Column({ name: "hall_id" })
    hallId: string;

    @ManyToOne(() => TypeOrmHall, (hall) => hall.seats, { onDelete: "CASCADE" })
    @JoinColumn({ name: "hall_id" })
    hall: TypeOrmHall;

    @OneToMany(() => TypeOrmTicket, (ticket) => ticket.seat)
    tickets: TypeOrmTicket[];
}
