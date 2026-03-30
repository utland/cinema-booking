import { Exclude } from 'class-transformer';
import { Role } from 'src/domain/user/models/user.entity';
import { TypeOrmTicket } from 'src/infrastructure/persistence/ticket/entities/typeorm-ticket.entity';
import {
  Entity,
  Column,
  OneToMany,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
@Index(['login'])
export class TypeOrmUser {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  login: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => TypeOrmTicket, (ticket) => ticket.user)
  tickets: TypeOrmTicket[];

  @Column({ type: 'date', name: "created_at"})
  createdAt: Date;
}
