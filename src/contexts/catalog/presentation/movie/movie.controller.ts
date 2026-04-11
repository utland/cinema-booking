import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from "@nestjs/common";
import { CreateMovieApiDto } from "./dtos/create-movie-api.dto";
import { UpdateMovieApiDto } from "./dtos/update-movie-api.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Roles } from "src/common/presentation/decorators/role.decorator";
import { CreateMovieCommand } from "../../application/movie/commands/create-movie/create-movie.command";
import { FindMovieAllQuery } from "../../application/movie/queries/find-movie-all/find-movie-all.query";
import { FindActiveMoviesQuery } from "../../application/movie/queries/find-active-movies/find-active-movies.query";
import { FindMovieByIdQuery } from "../../application/movie/queries/find-movie-by-id/find-movie-by-id.query";
import { UpdateMovieCommand } from "../../application/movie/commands/update-movie/update-movie.command";
import { DeleteMovieCommand } from "../../application/movie/commands/delete-movie/delete-movie.command";
import { Role } from "src/common/domain/enums/user-role.enum";

@Controller("movie")
export class MovieController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createMovieDto: CreateMovieApiDto) {
        const { title, duration, description, genre, rentStart, rentEnd } = createMovieDto;

        return this.commandBus.execute(new CreateMovieCommand(title, duration, description, genre, rentStart, rentEnd));
    }

    @Roles(Role.ADMIN)
    @Get("/all")
    public async findAll() {
        return this.queryBus.execute(new FindMovieAllQuery());
    }

    @Get()
    public async findByRentDate() {
        return this.queryBus.execute(new FindActiveMoviesQuery());
    }

    @Get("/:id")
    public async findOne(@Param("id", new ParseUUIDPipe()) movieId: string) {
        return this.queryBus.execute(new FindMovieByIdQuery(movieId));
    }

    @Roles(Role.ADMIN)
    @Patch("/:id")
    public async update(@Param("id", new ParseUUIDPipe()) movieId: string, @Body() updateMovieDto: UpdateMovieApiDto) {
        const { title, description, duration, genre, rentEnd, rentStart } = updateMovieDto;

        return this.commandBus.execute(
            new UpdateMovieCommand(movieId, title, duration, description, genre, rentStart, rentEnd)
        );
    }

    @Roles(Role.ADMIN)
    @Delete("/:id")
    public async remove(@Param("id", new ParseUUIDPipe()) movieId: string) {
        return this.commandBus.execute(new DeleteMovieCommand(movieId));
    }
}
