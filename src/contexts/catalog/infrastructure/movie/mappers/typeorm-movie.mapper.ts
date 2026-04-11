import { TypeOrmMovie } from "../entities/typeorm-movie.entity";
import { Injectable } from "@nestjs/common";
import { EntityMapper } from "src/common/interfaces/entity-mapper";
import { Movie } from "src/contexts/catalog/domain/movie/models/movie.entity";

@Injectable()
export class TypeOrmMovieMapper implements EntityMapper<Movie, TypeOrmMovie> {
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
