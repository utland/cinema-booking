import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { UserService } from 'src/application/user/user.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { Payload } from 'src/application/common/models/payload.i';
import { UpdateUserApiDto } from './dtos/update-user-api.dto';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from 'src/domain/user/models/user.entity';
import { CreateUserApiDto } from './dtos/create-user-api.dto';
import { ValidateUserApiDto } from './dtos/sign-in-api.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("/sign-up")
  public async signUp(@Body() createUserDto: CreateUserApiDto) {
    return await this.userService.create(createUserDto);
  }

  @Public()
  @Post("/sign-in")
  public async signIn(@Body() validateUserDto: ValidateUserApiDto) {
    return await this.userService.validate(validateUserDto);
  }

  @Get()
  public async findById(@CurrentUser() user: Payload) {
    return await this.userService.findById(user.id);
  }

  @Patch()
  public async update(
    @CurrentUser() user: Payload,
    @Body() updateUserDto: UpdateUserApiDto,
  ) {
    return await this.userService.update({ ...updateUserDto, userId: user.id });
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id') userId: string) {
    return await this.userService.remove(userId);
  }
}
