import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from "@nestjs/common";
import { CreateSessionReqDto } from "./dtos/request/create-session.request.dto";
import { FindSessionsByMovieReqDto } from "./dtos/request/find-sessions-by-movie.request.dto";
import { UpdateSessionReqDto } from "./dtos/request/update-session.request.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateSessionCommand } from "../../application/session/commands/create-session/create-session.command";
import { Roles } from "src/common/presentation/decorators/role.decorator";
import { FindSessionsByMovieQuery } from "../../application/session/queries/find-sessions-by-movie/find-sessions-by-movie.query";
import { FindSessionWithHallQuery } from "../../application/session/queries/find-session-with-hall/find-session-with-hall.query";
import { UpdateSessionCommand } from "../../application/session/commands/update-session/update-session.command";
import { DeleteSessionCommand } from "../../application/session/commands/delete-session/delete-session.command";
import { Role } from "src/common/domain/enums/user-role.enum";
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { FindSessionResDto } from "./dtos/response/find-session.response.dto";
import { FindSessionItemByMovieResDto } from "./dtos/response/find-session-item.response.dto";

@ApiBearerAuth()
@Controller("session")
export class SessionController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Create a new session" })
    public async create(@Body() createSessionDto: CreateSessionReqDto): Promise<void> {
        const { startTime, finishTime, basePrice, movieId, hallId, bookingTime } = createSessionDto;
        await this.commandBus.execute(
            new CreateSessionCommand(startTime, finishTime, bookingTime, basePrice, movieId, hallId)
        );
    }

    @Get()
    @ApiOperation({ summary: "Find sessions by movie and date" })
    @ApiOkResponse({ type: [FindSessionItemByMovieResDto], description: "List of sessions for a movie" })
    public async findByMovie(
        @Query() findSessionByMovieDto: FindSessionsByMovieReqDto
    ): Promise<FindSessionItemByMovieResDto[]> {
        const { movieId, dateOfSession } = findSessionByMovieDto;

        const result = await this.queryBus.execute(new FindSessionsByMovieQuery(movieId, dateOfSession));
        return result;
    }

    @Get("/:id")
    @ApiOperation({ summary: "Get a session by ID" })
    @ApiOkResponse({ type: FindSessionResDto, description: "Session details with hall info" })
    public async findById(@Param("id", new ParseUUIDPipe()) sessionId: string): Promise<FindSessionResDto> {
        const result = await this.queryBus.execute(new FindSessionWithHallQuery(sessionId));
        return result;
    }

    @Patch("/:id")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Update an existing session" })
    public async update(
        @Param("id", new ParseUUIDPipe()) sessionId: string,
        @Body() updateSessionDto: UpdateSessionReqDto
    ): Promise<void> {
        const { startTime, finishTime, basePrice, bookingTime } = updateSessionDto;

        await this.commandBus.execute(
            new UpdateSessionCommand(sessionId, startTime, finishTime, bookingTime, basePrice)
        );
    }

    @Delete("/:id")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Delete a session" })
    public async remove(@Param("id", new ParseUUIDPipe()) sessionId: string): Promise<void> {
        await this.commandBus.execute(new DeleteSessionCommand(sessionId));
    }
}
