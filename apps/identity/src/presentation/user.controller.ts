import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { Role } from "@app/shared-kernel/domain/enums/user-role.enum";
import { type Payload } from "@app/shared-kernel/interfaces/payload.i";
import { CurrentUser } from "@app/shared-kernel/presentation/decorators/current-user.decorator";
import { Public } from "@app/shared-kernel/presentation/decorators/public.decorator";
import { Roles } from "@app/shared-kernel/presentation/decorators/role.decorator";
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { CreateUserCommand } from "../application/commands/create-user/create-user.command";
import { CreateUserReqDto } from "./dtos/request/create-user.request.dto";
import { ValidateUserResDto } from "./dtos/response/sign-in.response.dto";
import { ValidateUserReqDto } from "./dtos/request/sign-in.request.dto";
import { ValidateUserQuery } from "../application/queries/validate-user/validate-user.query";
import { FindByIdResDto } from "./dtos/response/find-by-id.response.dto";
import { FindUserByIdQuery } from "../application/queries/find-user-by-id/find-user-by-id.query";
import { UpdateUserCommand } from "../application/commands/update-user/update-user.command";
import { DeleteUserCommand } from "../application/commands/delete-user/delete-user.command";
import { UpdateUserReqDto } from "./dtos/request/update-user.request.dto";

@ApiTags("Identity")
@Controller("user")
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Public()
    @Post("/sign-up")
    @ApiOperation({ summary: "Register a new user" })
    public async signUp(@Body() createUserDto: CreateUserReqDto): Promise<void> {
        const { email, password, login, firstName, lastName } = createUserDto;
        await this.commandBus.execute(new CreateUserCommand(email, password, login, firstName, lastName));
    }

    @Public()
    @Post("/sign-in")
    @ApiOperation({ summary: "Authenticate a user" })
    @ApiOkResponse({ type: ValidateUserResDto, description: "User authenticated successfully" })
    public async signIn(@Body() validateUserDto: ValidateUserReqDto): Promise<ValidateUserResDto> {
        const { login, password } = validateUserDto;

        const result = await this.queryBus.execute(new ValidateUserQuery(login, password));
        return result;
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get the authenticated user's profile" })
    @ApiOkResponse({ type: FindByIdResDto, description: "Current user profile" })
    public async findById(@CurrentUser() user: Payload): Promise<FindByIdResDto> {
        const result = await this.queryBus.execute(new FindUserByIdQuery(user.id));
        return result;
    }

    @Patch()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update the authenticated user's profile" })
    public async update(@CurrentUser() user: Payload, @Body() updateUserDto: UpdateUserReqDto): Promise<void> {
        const { firstName, lastName } = updateUserDto;

        await this.commandBus.execute(new UpdateUserCommand(user.id, firstName, lastName));
    }

    @Delete("/:id")
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a user by ID" })
    public async remove(@Param("id", new ParseUUIDPipe()) userId: string): Promise<void> {
        await this.commandBus.execute(new DeleteUserCommand(userId));
    }
}
