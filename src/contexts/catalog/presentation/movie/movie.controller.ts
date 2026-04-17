import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors } from "@nestjs/common";
import { CreateMovieReqDto } from "./dtos/request/create-movie.request.dto";
import { UpdateMovieReqDto } from "./dtos/request/update-movie.request.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Roles } from "src/common/presentation/decorators/role.decorator";
import { CreateMovieCommand } from "../../application/movie/commands/create-movie/create-movie.command";
import { FindMovieAllQuery } from "../../application/movie/queries/find-movie-all/find-movie-all.query";
import { FindActiveMoviesQuery } from "../../application/movie/queries/find-active-movies/find-active-movies.query";
import { FindMovieByIdQuery } from "../../application/movie/queries/find-movie-by-id/find-movie-by-id.query";
import { UpdateMovieCommand } from "../../application/movie/commands/update-movie/update-movie.command";
import { DeleteMovieCommand } from "../../application/movie/commands/delete-movie/delete-movie.command";
import { Role } from "src/common/domain/enums/user-role.enum";
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { FindMoviesItemResDto } from "./dtos/response/find-movies-item.response.dto";
import { FindMovieResDto } from "./dtos/response/find-movie.response.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiBearerAuth()
@Controller("movie")
export class MovieController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Create a new movie" })
    public async create(@Body() createMovieDto: CreateMovieReqDto): Promise<void> {
        const { title, duration, description, genre, rentStart, rentEnd } = createMovieDto;

        await this.commandBus.execute(new CreateMovieCommand(title, duration, description, genre, rentStart, rentEnd));
    }

    @Get("/all")
    @Roles(Role.ADMIN)
    @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: "Get all movies" })
    @ApiOkResponse({ type: [FindMoviesItemResDto], description: "List of all movies" })
    public async findAll(): Promise<FindMoviesItemResDto[]> {
        const result = await this.queryBus.execute(new FindMovieAllQuery());
        return result;
    }

    @Get()
    @ApiOperation({ summary: "Get currently rentable movies" })
    @ApiOkResponse({ type: [FindMoviesItemResDto], description: "List of active movies" })
    public async findByRentDate(): Promise<FindMoviesItemResDto[]> {
        const result = await this.queryBus.execute(new FindActiveMoviesQuery());
        return result;
    }

    @Get("/:id")
    @ApiOperation({ summary: "Get a movie by ID" })
    @ApiOkResponse({ type: FindMovieResDto, description: "Movie details" })
    public async findOne(@Param("id", new ParseUUIDPipe()) movieId: string): Promise<FindMovieResDto> {
        const result = await this.queryBus.execute(new FindMovieByIdQuery(movieId));
        return result;
    }

    @Patch("/:id")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Update an existing movie" })
    public async update(
        @Param("id", new ParseUUIDPipe()) movieId: string,
        @Body() updateMovieDto: UpdateMovieReqDto
    ): Promise<void> {
        const { title, description, duration, genre, rentEnd, rentStart } = updateMovieDto;

        await this.commandBus.execute(
            new UpdateMovieCommand(movieId, title, duration, description, genre, rentStart, rentEnd)
        );
    }

    @Delete("/:id")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Delete a movie" })
    public async remove(@Param("id", new ParseUUIDPipe()) movieId: string): Promise<void> {
        await this.commandBus.execute(new DeleteMovieCommand(movieId));
    }
}
