import { Controller, Get, Body, Patch, Param, Delete, Post, ParseUUIDPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Public } from "src/common/presentation/decorators/public.decorator";
import { CreateUserApiDto } from "./dtos/create-user-api.dto";
import { CreateUserCommand } from "../application/commands/create-user/create-user.command";
import { ValidateUserApiDto } from "./dtos/sign-in-api.dto";
import { ValidateUserQuery } from "../application/queries/validate-user/validate-user.query";
import type { Payload } from "src/common/interfaces/payload.i";
import { CurrentUser } from "src/common/presentation/decorators/current-user.decorator";
import { FindUserByIdQuery } from "../application/queries/find-user-by-id/find-user-by-id.query";
import { UpdateUserApiDto } from "./dtos/update-user-api.dto";
import { UpdateUserCommand } from "../application/commands/update-user/update-user.command";
import { DeleteUserCommand } from "../application/commands/delete-user/delete-user.command";
import { Roles } from "src/common/presentation/decorators/role.decorator";
import { Role } from "src/common/domain/enums/user-role.enum";

@Controller("user")
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Public()
    @Post("/sign-up")
    public async signUp(@Body() createUserDto: CreateUserApiDto) {
        const { email, password, login, firstName, lastName } = createUserDto;
        return await this.commandBus.execute(new CreateUserCommand(email, password, login, firstName, lastName));
    }

    @Public()
    @Post("/sign-in")
    public async signIn(@Body() validateUserDto: ValidateUserApiDto) {
        const { login, password } = validateUserDto;
        return await this.queryBus.execute(new ValidateUserQuery(login, password));
    }

    @Get()
    public async findById(@CurrentUser() user: Payload) {
        return await this.queryBus.execute(new FindUserByIdQuery(user.id));
    }

    @Patch()
    public async update(@CurrentUser() user: Payload, @Body() updateUserDto: UpdateUserApiDto) {
        const { firstName, lastName } = updateUserDto;

        return await this.commandBus.execute(new UpdateUserCommand(user.id, firstName, lastName));
    }

    @Roles(Role.ADMIN)
    @Delete("/:id")
    public async remove(@Param("id", new ParseUUIDPipe()) userId: string) {
        return await this.commandBus.execute(new DeleteUserCommand(userId));
    }
}
