import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateSeatsDto } from './dto/update-seat.dto';
import { DeleteSeatsDto } from './dto/delete-seats.dto';

@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Roles(Role.ADMIN)
  @Post()
  public async create(@Body() createHallDto: CreateHallDto) {
    return await this.hallService.create(createHallDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  public async findAll() {
    return await this.hallService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.hallService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Patch('/seats')
  public async updateSeats(
    @Body() updateSeatsDto: UpdateSeatsDto,
  ) {
    return await this.hallService.updateSeats(updateSeatsDto);
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateHallDto: UpdateHallDto,
  ) {
    return await this.hallService.updateInfo(id, updateHallDto);
  }


  @Roles(Role.ADMIN)
  @Delete('/seats')
  public async deleteSeats(@Body() deleteSeatsDto: DeleteSeatsDto) {
    return await this.hallService.deleteSeats(deleteSeatsDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.hallService.remove(id);
  }
}
