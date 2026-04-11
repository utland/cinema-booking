import { Controller, Get, Post, Body, Patch, Param, Delete, Query, SerializeOptions } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { FindSessionByMovieDto } from "./dto/find-by-movie.dto";
import { SessionService } from "./session.service";

@Controller("session")
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Roles(Role.ADMIN)
    @Post()
    public async create(@Body() createSessionDto: CreateSessionDto) {
        return await this.sessionService.create(createSessionDto);
    }

    @Get()
    @SerializeOptions({ groups: ["session.hall.info"] })
    public async findByMovie(@Body() findSessionByMovieDto: FindSessionByMovieDto) {
        return await this.sessionService.findByMovie(findSessionByMovieDto);
    }

    @Get("/:id")
    public async findById(@Param("id") sessionId: string, @Query("hallId") hallId: string) {
        return await this.sessionService.findSessionHallById(sessionId, hallId);
    }

    @Roles(Role.ADMIN)
    @Patch("/:id")
    public async update(@Param("id") id: string, @Body() updateSessionDto: UpdateSessionDto) {
        return this.sessionService.update(id, updateSessionDto);
    }

    @Roles(Role.ADMIN)
    @Delete("/:id")
    remove(@Param("id") id: string) {
        return this.sessionService.remove(id);
    }
}
