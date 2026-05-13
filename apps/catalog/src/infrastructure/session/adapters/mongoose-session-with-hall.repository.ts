import { SessionWithHallArgs, SessionWithHallRepository } from "@app/catalog/application/session/ports/session-with-hall.repository";
import { SessionWithHallDto } from "@app/catalog/application/session/queries/dtos/session-with-hall.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { toSessionWithHallDto } from "../mappers/to-session-with-hall.mapper";
import { Hall } from "@app/catalog/domain/hall/models/hall.entity";
import { MongooseSessionWithHall } from "../entities/mongoose-session-with-hall.schema";

export class MongooseSessionWithHallRepository implements SessionWithHallRepository {
    constructor(
        @InjectModel(MongooseSessionWithHall.name)
        private readonly sessionWithHallModel: Model<MongooseSessionWithHall>
    ) {}

    
    public async findById(sessionId: string): Promise<SessionWithHallDto | null> {
        const session = await this.sessionWithHallModel.findOne({ sessionId }).exec();
        if (!session) return null;
        
        return toSessionWithHallDto(session);
    }

    public async save(sessionArgs: SessionWithHallArgs, hall: Hall): Promise<void> {
        const sessionWithHall = new this.sessionWithHallModel({
            sessionId: sessionArgs.sessionId,
            startTime: sessionArgs.start,
            endTime: sessionArgs.end,
            bookingTime: sessionArgs.bookingTime,
            hallId: hall.id,
            hallName: hall.name,
            hallType: hall.type,
            seats: hall.seats.map((item) => {
                return {
                    seatId: item.id,
                    row: item.row,
                    column: item.column,
                    isAvailable: true
                };
            })
        });

        await sessionWithHall.save();
    }

    public async updateSession(
        sessionArgs: SessionWithHallArgs
    ): Promise<void> {
        await this.sessionWithHallModel.updateOne(
            { sessionId: sessionArgs.sessionId },
            { $set: { startTime: sessionArgs.start, endTime: sessionArgs.end, bookingTime: sessionArgs.bookingTime } }
        ).exec();    
    }

    public async updateHall(id: string,name: string, type: string): Promise<void> {
        await this.sessionWithHallModel.updateMany(
            { hallId: id },
            { $set: { hallType: type, hallName: name } }
        ).exec();
    }

    public async updateSeat(
        sessionId: string, seatId: string, isAvailable: boolean
    ): Promise<void> {
        await this.sessionWithHallModel.updateOne(
            { sessionId, "seats.seatId": seatId },
            { $set: { "seats.$.isAvailable": isAvailable } }
        ).exec();
    }   
}