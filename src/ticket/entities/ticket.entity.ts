import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { Seat } from 'src/hall/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';

export enum TicketStatus {
  RESERVED = 'Reserved',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

@Entity('tickets')
@Index(['sessionId', 'seatId'], { unique: true })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.RESERVED })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  price: number;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'seat_id' })
  seatId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Session, (session) => session.tickets)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Seat, (seat) => seat.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @ManyToOne(() => User, (user) => user.tickets, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
