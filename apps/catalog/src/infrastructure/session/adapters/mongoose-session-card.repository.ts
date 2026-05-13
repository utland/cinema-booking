import { SessionInMovieArgs, SessionInMovieRepository } from "@app/catalog/application/session/ports/session-card.repository";
import { Hall } from "@app/catalog/domain/hall/models/hall.entity";
import { InjectModel } from "@nestjs/mongoose";
import { MongooseSessionInMovie } from "../entities/mongoose-session-card.entity";
import { Model } from "mongoose";
import { SessionInMovieDto } from "@app/catalog/application/session/queries/dtos/session-in-movie.dto";
import { toSessionsInMovieDto } from "../mappers/to-sessions-in-movie.mapper";
import { endOfDay, startOfDay } from "date-fns";

export class MongooseSessionInMovieRepository implements SessionInMovieRepository {
    constructor(
        @InjectModel(MongooseSessionInMovie.name)
        private readonly sessionInMovieModel: Model<MongooseSessionInMovie>
    ) {}

    public async findByMovieId(movieId: string, dateOfSession: Date): Promise<SessionInMovieDto[]> {
        const sessions = await this.sessionInMovieModel.find({ 
            movieId,  
            startTime: { $gte: startOfDay(dateOfSession), $lt: endOfDay(dateOfSession) }
        }).exec();

        return toSessionsInMovieDto(sessions);
    }

    public async save(sessionArgs: SessionInMovieArgs, hall: Hall): Promise<void> {
        const sessionInMovie = new this.sessionInMovieModel({
            sessionId: sessionArgs.sessionId,
            startTime: sessionArgs.start,
            endTime: sessionArgs.end,
            bookingTime: sessionArgs.bookingTime,
            basePrice: sessionArgs.basePrice,
            hallName: hall.name,
            availableSeats: hall.seats.length,
            totalSeats: hall.seats.length
        });

        await sessionInMovie.save();
    }

    public async updateSession(
        sessionArgs: SessionInMovieArgs
    ): Promise<void> {
        await this.sessionInMovieModel.updateOne(
            { sessionId: sessionArgs.sessionId },
            { $set: { 
                    startTime: sessionArgs.start, 
                    endTime: sessionArgs.end, 
                    bookingTime: sessionArgs.bookingTime, 
                    basePrice: sessionArgs.basePrice 
                } 
            }
        ).exec();  
    }

    public async updateHall(name: string, seatsAmount: number): Promise<void> {
        await this.sessionInMovieModel.updateMany(
            { hallName: name },
            { $set: { availableSeats: seatsAmount, totalSeats: seatsAmount } }
        ).exec();
    }

    public async updateAvailable(sessionId: string,operation: "increase" | "decrease"): Promise<void> {
        await this.sessionInMovieModel.updateOne(
            { sessionId },
            { $inc: { availableSeats: operation === "increase" ? 1 : -1 } }
        ).exec();
    }
}