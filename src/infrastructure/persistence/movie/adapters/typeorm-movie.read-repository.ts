import { MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";
import { TypeOrmMovieMapper } from "../mappers/typeorm-movie.mapper";
import { Movie } from "src/domain/movie/models/movie.entity";
import { Injectable } from "@nestjs/common";
import { MovieReadRepository } from "src/application/movie/ports/movie.read-repository";
import { MovieInfoDto } from "src/application/movie/queries/dtos/movie-info.dto";
import { toMovieInfoDto } from "../mappers/to-movie-info.mapper";
import { toMovieListDto } from "../mappers/to-movie-list.mapper";
import { MovieListItemDto } from "src/application/movie/queries/dtos/movie-list-item.dto";

@Injectable()
export class TypeOrmMovieReadRepository implements MovieReadRepository {
    constructor(
        @InjectRepository(TypeOrmMovie)
        private readonly movieRepo: Repository<TypeOrmMovie>,

        private readonly movieMapper: TypeOrmMovieMapper
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

        const moviesOrm = await this.movieRepo.find({
            where: { rentStart: MoreThan(today) }
        });

        const movieDto = toMovieListDto(moviesOrm);
        return movieDto;
    }
}
