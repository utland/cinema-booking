import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TypeOrmSession } from "../../session/entities/typeorm-session.entity";

@Entity("movies")
export class TypeOrmMovie {
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ name: "duration" })
    duration: number;

    @Column()
    description: string;

    @Column()
    genre: string;

    @Column({ type: "timestamp", name: "rent_start" })
    rentStart: Date;

    @Column({ type: "timestamp", name: "rent_end" })
    rentEnd: Date;

    @OneToMany(() => TypeOrmSession, (session) => session.movie)
    sessions: TypeOrmSession[];
}
