import { forwardRef, Module } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { SessionModule } from "src/session/session.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";

@Module({
    imports: [forwardRef(() => SessionModule), TypeOrmModule.forFeature([Movie])],
    controllers: [MovieController],
    providers: [MovieService],
    exports: [MovieService]
})
export class MovieModule {}
