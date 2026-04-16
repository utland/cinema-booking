import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from "@nestjs/common";

import { CreateHallReqDto } from "./dtos/request/create-hall.request.dto";
import { UpdateSeatsReqDto } from "./dtos/request/update-seats.request.dto";
import { UpdateHallInfoReqDto } from "./dtos/request/update-hall-info.request.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Roles } from "src/common/presentation/decorators/role.decorator";
import { CreateHallCommand } from "../../application/hall/commands/create-hall/create-hall.command";
import { FindHallByIdQuery } from "../../application/hall/queries/find-hall-by-id/find-hall-by-id.query";
import { UpdateSeatsCommand } from "../../application/hall/commands/update-seats/update-seats.command";
import { UpdateHallInfoCommand } from "../../application/hall/commands/update-hall-info/update-hall-info.command";
import { DeleteHallCommand } from "../../application/hall/commands/delete-hall/delete-hall.command";
import { Role } from "src/common/domain/enums/user-role.enum";
import { FindHallAllQuery } from "../../application/hall/queries/find-hall-all/find-hall-all.query";
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FindHallsItemResDto } from "./dtos/response/find-halls.response.dto";
import { FindHallByIdResDto } from "./dtos/response/find-hall-by-id.response.dto";

@ApiTags("Hall")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Authentication credentials were missing or invalid" })
@Roles(Role.ADMIN)
@Controller("hall")
export class HallController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    @ApiOperation({ summary: "Create a new hall" })
    @ApiCreatedResponse({ description: "Hall created successfully" })
    @ApiBadRequestResponse({ description: "Invalid hall creation data" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    public async create(@Body() createHallDto: CreateHallReqDto): Promise<void> {
        const { name, type, seats } = createHallDto;
        await this.commandBus.execute(new CreateHallCommand(name, type, seats));
    }

    @Get()
    @ApiOperation({ summary: "Get all halls" })
    @ApiOkResponse({ type: [FindHallsItemResDto], description: "List of halls" })
    public async findAll(): Promise<FindHallsItemResDto[]>  {
        const result = await this.queryBus.execute(new FindHallAllQuery());
        return result.map((item) => ({ hallId: item.hallId, name: item.name, amountOfSeats: item.amountOfSeats }));
    }

    @Get("/:id")
    @ApiOperation({ summary: "Get a hall by ID" })
    @ApiOkResponse({ type: FindHallByIdResDto, description: "Hall details" })
    @ApiNotFoundResponse({ description: "Hall not found" })
    public async findOne(@Param("id", new ParseUUIDPipe()) hallId: string): Promise<FindHallByIdResDto> {
        const result = await this.queryBus.execute(new FindHallByIdQuery(hallId));
        return { ...result };
    }

    @Patch("/seats")
    @ApiOperation({ summary: "Update hall seats" })
    @ApiOkResponse({ description: "Hall seats updated successfully" })
    @ApiNotFoundResponse({ description: "Hall not found" })
    @ApiConflictResponse({ description: "Cannot update seats while sessions are ongoing" })
    @ApiBadRequestResponse({ description: "Invalid seat update data" })
    public async updateSeats(@Body() updateSeatsDto: UpdateSeatsReqDto): Promise<void>  {
        const { hallId, seats } = updateSeatsDto;
        await this.commandBus.execute(new UpdateSeatsCommand(hallId, seats));
    }

    @Patch("/:id")
    @ApiOperation({ summary: "Update hall information" })
    @ApiOkResponse({ description: "Hall information updated successfully" })
    @ApiNotFoundResponse({ description: "Hall not found" })
    @ApiConflictResponse({ description: "Cannot update hall while sessions are ongoing" })
    @ApiBadRequestResponse({ description: "Invalid hall update data" })
    public async updateInfo(
        @Param("id", new ParseUUIDPipe()) hallId: string,
        @Body() updateHallDto: UpdateHallInfoReqDto
    ): Promise<void> {
        const { name, type } = updateHallDto;
        await this.commandBus.execute(new UpdateHallInfoCommand(hallId, name, type));
    }

    @Delete("/:id")
    @ApiOperation({ summary: "Delete a hall" })
    @ApiOkResponse({ description: "Hall deleted successfully" })
    @ApiNotFoundResponse({ description: "Hall not found" })
    @ApiConflictResponse({ description: "Cannot delete hall while sessions are ongoing" })
    public async remove(@Param("id", new ParseUUIDPipe()) hallId: string): Promise<void>  {
        await this.commandBus.execute(new DeleteHallCommand(hallId));
    }
}
