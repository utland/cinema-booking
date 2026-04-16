import { Controller, Get, Body, Patch, Param, Delete, Post, ParseUUIDPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Public } from "src/common/presentation/decorators/public.decorator";
import { CreateUserReqDto } from "./dtos/request/create-user.request.dto";
import { CreateUserCommand } from "../application/commands/create-user/create-user.command";
import { ValidateUserReqDto } from "./dtos/request/sign-in.request.dto";
import { ValidateUserQuery } from "../application/queries/validate-user/validate-user.query";
import type { Payload } from "src/common/interfaces/payload.i";
import { CurrentUser } from "src/common/presentation/decorators/current-user.decorator";
import { FindUserByIdQuery } from "../application/queries/find-user-by-id/find-user-by-id.query";
import { UpdateUserReqDto } from "./dtos/request/update-user.request.dto";
import { UpdateUserCommand } from "../application/commands/update-user/update-user.command";
import { DeleteUserCommand } from "../application/commands/delete-user/delete-user.command";
import { Roles } from "src/common/presentation/decorators/role.decorator";
import { Role } from "src/common/domain/enums/user-role.enum";
import { UserProfileDto } from "../application/queries/dtos/user-profile.dto";
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiNotAcceptableResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";
import { ValidateUserResDto } from "./dtos/response/sign-in.response.dto";
import { FindByIdResDto } from "./dtos/response/find-by-id.response.dto";

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
    @ApiCreatedResponse({ description: "User registered successfully" })
    @ApiConflictResponse({ description: "Login/email already exists" })
    @ApiBadRequestResponse({ description: "Invalid registration data" })
    public async signUp(@Body() createUserDto: CreateUserReqDto): Promise<void> {
        const { email, password, login, firstName, lastName } = createUserDto;
        await this.commandBus.execute(new CreateUserCommand(email, password, login, firstName, lastName));
    }

    @Public()
    @Post("/sign-in")
    @ApiOperation({ summary: "Authenticate a user" })
    @ApiOkResponse({ type: ValidateUserResDto, description: "User authenticated successfully" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiNotAcceptableResponse({ description: "Incorrect password" })
    @ApiBadRequestResponse({ description: "Invalid login or password" })
    public async signIn(@Body() validateUserDto: ValidateUserReqDto): Promise<ValidateUserResDto> {
        const { login, password } = validateUserDto;

        const result = await this.queryBus.execute(new ValidateUserQuery(login, password));
        return result
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get the authenticated user's profile" })
    @ApiOkResponse({ type: FindByIdResDto, description: "Current user profile" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiUnauthorizedResponse({ description: "Authentication credentials were missing or invalid" })
    public async findById(@CurrentUser() user: Payload): Promise<FindByIdResDto> {
        const result = await this.queryBus.execute(new FindUserByIdQuery(user.id));
        return result;
    }

    @Patch()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update the authenticated user's profile" })
    @ApiOkResponse({ description: "User profile updated successfully" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiBadRequestResponse({ description: "Invalid registration data" })
    @ApiUnauthorizedResponse({ description: "Authentication credentials were missing or invalid" })
    public async update(@CurrentUser() user: Payload, @Body() updateUserDto: UpdateUserReqDto): Promise<void> {
        const { firstName, lastName } = updateUserDto;

        await this.commandBus.execute(new UpdateUserCommand(user.id, firstName, lastName));
    }

    @Delete("/:id")
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a user by ID" })
    @ApiOkResponse({ description: "User deleted successfully" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiBadRequestResponse({ description: "Invalid registration data" })
    @ApiUnauthorizedResponse({ description: "Authentication credentials were missing or invalid" })
    @ApiForbiddenResponse({ description: "You do not have permission to perform this action" })
    public async remove(@Param("id", new ParseUUIDPipe()) userId: string): Promise<void> {
        await this.commandBus.execute(new DeleteUserCommand(userId));
    }
}
