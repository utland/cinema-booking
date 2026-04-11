import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("tickets")
export class TypeOrmTicket {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: TicketStatus, default: TicketStatus.RESERVED })
    status: string;

    @Column({ name: "created_at", type: "date" })
    createdAt: Date;

    @Column()
    price: number;

    @Column({ name: "session_id", type: "uuid" })
    sessionId: string;

    @Column({ name: "seat_id", type: "uuid" })
    seatId: string;

    @Column({ name: "user_id", type: "uuid" })
    userId: string;
}
