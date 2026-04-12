import { Movie } from "src/domain/movie/models/movie.entity";
import { TypeOrmMapper } from "src/infrastructure/common/interfaces/typeorm-mapper.i";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeOrmMovieMapper implements TypeOrmMapper<Movie, TypeOrmMovie> {
    public toDomain(ormEntity: TypeOrmMovie): Movie {
        return new Movie(
            ormEntity.title,
            ormEntity.duration,
            ormEntity.description,
            ormEntity.genre,
            ormEntity.rentStart,
            ormEntity.rentEnd,
            ormEntity.id
        );
    }

    public toOrm(domainEntity: Movie): TypeOrmMovie {
        const ormMovie = new TypeOrmMovie();

        ormMovie.id = domainEntity.id;
        ormMovie.title = domainEntity.title;
        ormMovie.duration = domainEntity.duration;
        ormMovie.description = domainEntity.description;
        ormMovie.genre = domainEntity.genre;
        ormMovie.rentStart = domainEntity.rentDate.start;
        ormMovie.rentEnd = domainEntity.rentDate.end;

        return ormMovie;
    }
}
