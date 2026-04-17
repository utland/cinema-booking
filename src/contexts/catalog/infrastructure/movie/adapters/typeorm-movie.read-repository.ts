import { LessThan, LessThanOrEqual, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";
import { Injectable } from "@nestjs/common";
import { toMovieInfoDto } from "../mappers/to-movie-info.mapper";
import { toMovieListDto } from "../mappers/to-movie-list.mapper";
import { MovieReadRepository } from "src/contexts/catalog/application/movie/ports/movie.read-repository";
import { MovieInfoDto } from "src/contexts/catalog/application/movie/queries/dtos/movie-info.dto";
import { MovieListItemDto } from "src/contexts/catalog/application/movie/queries/dtos/movie-list-item.dto";

@Injectable()
export class TypeOrmMovieReadRepository implements MovieReadRepository {
    constructor(
        @InjectRepository(TypeOrmMovie)
        private readonly movieRepo: Repository<TypeOrmMovie>
    ) {}

    public async findById(id: string): Promise<MovieInfoDto | null> {
        const movieOrm = await this.movieRepo.findOne({ where: { id } });
        if (!movieOrm) return null;

        const movieDto = toMovieInfoDto(movieOrm);
        return movieDto;
    }

    public async findAll(): Promise<MovieListItemDto[]> {
        const moviesOrm = await this.movieRepo.find();

        const movieDto = toMovieListDto(moviesOrm);
        return movieDto;
    }

    public async findActive(): Promise<MovieListItemDto[]> {
        const today = new Date();
        const showStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const moviesOrm = await this.movieRepo.find({
            where: { rentEnd: MoreThan(today), rentStart: LessThanOrEqual(showStart) }
        });

        const movieDto = toMovieListDto(moviesOrm);
        return movieDto;
    }
}
