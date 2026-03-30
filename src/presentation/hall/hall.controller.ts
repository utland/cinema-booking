import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HallService } from 'src/application/hall/hall.service';
import { Role } from 'src/domain/user/models/user.entity';
import { Roles } from '../common/decorators/role.decorator';
import { CreateHallApiDto } from './dtos/create-hall-api.dto';
import { UpdateSeatsApiDto } from './dtos/update-seats-api.dto';
import { UpdateHallInfoApiDto } from './dtos/update-hall-info-api.dto';

@Roles(Role.ADMIN)
@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Post()
  public async create(@Body() createHallDto: CreateHallApiDto) {
    return await this.hallService.create(createHallDto);
  }

  @Get()
  public async findAll() {
    return await this.hallService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param('id', new ParseUUIDPipe()) hallId: string) {
    return await this.hallService.findById(hallId);
  }

  @Patch('/seats')
  public async updateSeats(
    @Body() updateSeatsDto: UpdateSeatsApiDto,
  ) {
    return await this.hallService.updateSeats(updateSeatsDto);
  }

  @Patch('/:id')
  public async updateInfo(
    @Param('id', new ParseUUIDPipe()) hallId: string,
    @Body() updateHallDto: UpdateHallInfoApiDto,
  ) {
    return await this.hallService.updateInfo({ ...updateHallDto, hallId});
  }

  @Delete('/:id')
  public async remove(@Param('id', new ParseUUIDPipe()) hallId: string) {
    return await this.hallService.delete(hallId);
  }
}
