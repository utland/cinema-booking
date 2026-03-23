import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Seat } from './seat.entity';
import { Session } from 'src/session/entities/session.entity';

export enum HallType {
  STANDART = 'standart',
  VIP = 'vip',
}

@Entity('halls')
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: HallType, default: HallType.STANDART })
  type: HallType;

  @OneToMany(() => Seat, (seat) => seat.hall, { cascade: true })
  seats: Seat[];

  @OneToMany(() => Session, (session) => session.hall)
  sessions: Session[];
}
