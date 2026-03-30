import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { TypeOrmSession } from 'src/infrastructure/persistence/session/entities/typeorm-session.entity';
import { TypeOrmSeat } from 'src/infrastructure/persistence/hall/entities/typeorm-seat.entity';
import { TypeOrmUser } from 'src/infrastructure/persistence/user/entities/typeorm-user.entity';

export enum TicketStatus {
  RESERVED = 'Reserved',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

@Entity('tickets')
export class TypeOrmTicket {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.RESERVED })
  status: string;

  @Column({ name: 'created_at', type: "date" })
  createdAt: Date;

  @Column()
  price: number;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'seat_id' })
  seatId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => TypeOrmSession, (session) => session.tickets)
  @JoinColumn({ name: 'session_id' })
  session: TypeOrmSession;

  @ManyToOne(() => TypeOrmSeat, (seat) => seat.tickets, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'seat_id' })
  seat: TypeOrmSeat;

  @ManyToOne(() => TypeOrmUser, (user) => user.tickets, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: TypeOrmUser;
}
