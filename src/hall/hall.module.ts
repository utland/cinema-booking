import { Module } from "@nestjs/common";
import { HallService } from "./hall.service";
import { HallController } from "./hall.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hall } from "./entities/hall.entity";
import { Seat } from "./entities/seat.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Hall, Seat])],
    controllers: [HallController],
    providers: [HallService],
    exports: [HallService]
})
export class HallModule {}
