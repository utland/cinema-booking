import { TypeOrmSession } from 'src/infrastructure/persistence/session/entities/typeorm-session.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('movies')
export class TypeOrmMovie {
  @PrimaryColumn('uuid')
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

  @OneToMany(() => TypeOrmSession, (session) => session.movie)
  sessions: TypeOrmSession[];
}
