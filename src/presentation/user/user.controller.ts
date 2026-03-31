import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { Payload } from 'src/application/common/models/payload.i';
import { UpdateUserApiDto } from './dtos/update-user-api.dto';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from 'src/domain/user/models/user.entity';
import { CreateUserApiDto } from './dtos/create-user-api.dto';
import { ValidateUserApiDto } from './dtos/sign-in-api.dto';
import { Public } from '../common/decorators/public.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/user/commands/create-user/create-user.command';
import { FindUserByIdQuery } from 'src/application/user/queries/find-user-by-id/find-user-by-id.query';
import { UpdateUserCommand } from 'src/application/user/commands/update-user/update-user.command';
import { DeleteUserCommand } from 'src/application/user/commands/delete-user/delete-user.command';
import { ValidateUserQuery } from 'src/application/user/queries/validate-user/validate-user.query';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post("/sign-up")
  public async signUp(@Body() createUserDto: CreateUserApiDto) {
    const { email, password, login, firstName, lastName } = createUserDto;
    return await this.commandBus.execute(
      new CreateUserCommand(email, password, login, firstName, lastName)
    );
  }

  @Public()
  @Post("/sign-in")
  public async signIn(@Body() validateUserDto: ValidateUserApiDto) {
    const { login, password } = validateUserDto;
    return await this.queryBus.execute(
      new ValidateUserQuery(login, password)
    );
  }

  @Get()
  public async findById(@CurrentUser() user: Payload) {
    return await this.queryBus.execute(new FindUserByIdQuery(user.id));
  }

  @Patch()
  public async update(
    @CurrentUser() user: Payload,
    @Body() updateUserDto: UpdateUserApiDto,
  ) {
    const { firstName, lastName } = updateUserDto;
    
    return await this.commandBus.execute(
      new UpdateUserCommand(user.id, firstName, lastName)
    );
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id', new ParseUUIDPipe()) userId: string) {
    return await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
