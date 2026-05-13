import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class MongooseSessionInMovie extends Document {
    @Prop({ unique: true })
    sessionId: string;

    @Prop()
    hallName: string;

    @Prop()
    startTime: Date;

    @Prop()
    endTime: Date;

    @Prop()
    bookingTime: Date;

    @Prop()
    basePrice: number;

    @Prop()
    availableSeats: number;

    @Prop()
    totalSeats: number;
}

export const MongooseSessionInMovieSchema = SchemaFactory.createForClass(MongooseSessionInMovie);