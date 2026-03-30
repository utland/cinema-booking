import { MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";
import { MovieRepository } from "src/domain/movie/ports/movie.repository";
import { TypeOrmMovieMapper } from "../mappers/typeorm-movie.mapper";
import { Movie } from "src/domain/movie/models/movie.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeOrmMovieRepository implements MovieRepository {
    constructor(
        @InjectRepository(TypeOrmMovie)
        private readonly movieRepo: Repository<TypeOrmMovie>,

        private readonly movieMapper: TypeOrmMovieMapper
    ) {}

    public async findById(id: string): Promise<Movie | null> {
        const movieOrm = await this.movieRepo.findOne({ where: { id }});
        if (!movieOrm) return null;

        const movieDomain = this.movieMapper.toDomain(movieOrm);
        return movieDomain;
    }

    public async findAll(): Promise<Movie[]> {
        const moviesOrm = await this.movieRepo.find();

        const hallDomain = moviesOrm.map(item => this.movieMapper.toDomain(item));
        return hallDomain;
    }

    public async findActive(): Promise<Movie[]> {
        const today = new Date();
        const moviesOrm = await this.movieRepo.find({ 
            where: { rentStart: MoreThan(today) }
        });

        const hallDomain = moviesOrm.map(item => this.movieMapper.toDomain(item));
        return hallDomain;
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