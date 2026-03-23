import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type IPayload } from 'src/common/interfaces/payload.i';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async findById(@CurrentUser() user: IPayload) {
    return await this.userService.findById(user.id);
  }

  @Patch()
  public async update(
    @CurrentUser() user: IPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user.id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
