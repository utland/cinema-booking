import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { TypeOrmMovie } from "../../movie/entities/typeorm-movie.entity";
import { TypeOrmHall } from "../../hall/entities/typeorm-hall.entity";

@Entity("sessions")
export class TypeOrmSession {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ type: "timestamp", name: "start_time" })
    startTime: Date;

    @Column({ type: "timestamp", name: "finish_time" })
    finishTime: Date;

    @Column({ type: "decimal", name: "base_price" })
    basePrice: number;

    @Column({ name: "movie_id" })
    movieId: string;

    @Column({ name: "hall_id" })
    hallId: string;

    @ManyToOne(() => TypeOrmMovie, (movie) => movie.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "movie_id" })
    movie: TypeOrmMovie;

    @ManyToOne(() => TypeOrmHall, (hall) => hall.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "hall_id" })
    hall: TypeOrmHall;
}
