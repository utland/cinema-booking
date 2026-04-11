import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Hall } from "./hall.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";

@Entity("seats")
@Index(["hall", "rowNumber", "seatNumber"], { unique: true })
export class Seat {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "row_number" })
    rowNumber: number;

    @Column({ name: "seat_number" })
    seatNumber: number;

    @Column({ name: "is_available", default: true })
    IsAvailable: boolean;

    @Column({ name: "hall_id" })
    hallId: string;

    @ManyToOne(() => Hall, (hall) => hall.seats, { onDelete: "CASCADE" })
    @JoinColumn({ name: "hall_id" })
    hall: Hall;

    @OneToMany(() => Ticket, (ticket) => ticket.seat)
    tickets: Ticket[];
}
