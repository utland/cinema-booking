import { Hall } from "src/hall/entities/hall.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    ForeignKey,
    AfterLoad
} from "typeorm";
import { Ticket } from "../../ticket/entities/ticket.entity";
import { Movie } from "src/movie/entities/movie.entity";
import { Expose } from "class-transformer";

@Entity("sessions")
export class Session {
    @PrimaryGeneratedColumn("uuid")
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

    @ManyToOne(() => Movie, (movie) => movie.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "movie_id" })
    movie: Movie;

    @ManyToOne(() => Hall, (hall) => hall.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "hall_id" })
    hall: Hall;

    @OneToMany(() => Ticket, (ticket) => ticket.session)
    tickets: Ticket[];

    @Expose({ groups: ["session.hall.info"] })
    availableSeats: number;

    @Expose({ groups: ["session.hall.info"] })
    seatsNumber: number;

    @AfterLoad()
    calculateAvailableSeats() {
        if (!this.hall || !this.tickets || !this.hall.seats) return;

        this.seatsNumber = this.hall.seats.length;
        this.availableSeats = this.seatsNumber - this.tickets.length;
    }
}
