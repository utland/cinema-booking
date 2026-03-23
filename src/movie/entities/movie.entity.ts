import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from '../../session/entities/session.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'duration' })
  duration: number;

  @Column()
  description: string;

  @Column()
  genre: string;

  @Column({ type: 'date', name: 'rent_start' })
  rentStart: Date;

  @Column({ type: 'date', name: 'rent_end' })
  rentEnd: Date;

  @OneToMany(() => Session, (session) => session.movie)
  sessions: Session[];
}
