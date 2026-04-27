import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";
import { TypeOrmMovieMapper } from "../mappers/typeorm-movie.mapper";
import { Injectable } from "@nestjs/common";
import { MovieRepository } from "@app/catalog/domain/movie/ports/movie.repository";
import { Movie } from "@app/catalog/domain/movie/models/movie.entity";

@Injectable()
export class TypeOrmMovieRepository implements MovieRepository {
    constructor(
        @InjectRepository(TypeOrmMovie)
        private readonly movieRepo: Repository<TypeOrmMovie>,

        private readonly movieMapper: TypeOrmMovieMapper
    ) {}

    public async findById(id: string): Promise<Movie | null> {
        const movieOrm = await this.movieRepo.findOne({ where: { id } });
        if (!movieOrm) return null;

        const movieDomain = this.movieMapper.toDomain(movieOrm);
        return movieDomain;
    }

    public async save(movie: Movie): Promise<void> {
        const movieOrm = this.movieMapper.toOrm(movie);

        await this.movieRepo.save(movieOrm);
    }

    public async delete(movie: Movie): Promise<void> {
        const movieOrm = this.movieMapper.toOrm(movie);

        await this.movieRepo.remove(movieOrm);
    }
}
