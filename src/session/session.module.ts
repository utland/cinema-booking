import { forwardRef, Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionService } from "./session.service";
import { HallModule } from "src/hall/hall.module";
import { Session } from "./entities/session.entity";
import { MovieModule } from "src/movie/movie.module";

@Module({
    imports: [TypeOrmModule.forFeature([Session]), HallModule, forwardRef(() => MovieModule)],
    controllers: [SessionController],
    providers: [SessionService],
    exports: [SessionService]
})
export class SessionModule {}
