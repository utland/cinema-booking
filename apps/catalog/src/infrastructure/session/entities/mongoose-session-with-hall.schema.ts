import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

type SeatInfo = {
    seatId: string;
    row: number;
    column: number;
    isAvailable: string;
};

@Schema()
export class MongooseSessionWithHall extends Document {
    @Prop({ unique: true })
    sessionId: string;

    @Prop()
    startTime: Date;

    @Prop()
    endTime: Date;

    @Prop()
    bookingTime: Date;

    @Prop()
    hallId: string;

    @Prop()
    hallName: string;

    @Prop()
    hallType: string;

    @Prop({ type: [Object] })
    seats: SeatInfo[];
}

export const MongooseSessionWithHallSchema = SchemaFactory.createForClass(MongooseSessionWithHall);
