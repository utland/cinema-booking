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
import { Roles } from '../common/decorators/role.decorator';
import { MovieService } from 'src/application/movie/movie.service';
import { CreateMovieApiDto } from './dtos/create-movie-api.dto';
import { UpdateMovieApiDto } from './dtos/update-movie-api.dto';
import { Role } from 'src/domain/user/models/user.entity';


@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createMovieDto: CreateMovieApiDto) {
    return this.movieService.create(createMovieDto);
  }

  @Roles(Role.ADMIN)
  @Get("/all")
  public async findAll() {
    return this.movieService.findAll();
  }

  @Get()
  public async findByRentDate() {
    return this.movieService.findByRentDate();
  }

  @Get('/:id')
  public async findOne(@Param('id', new ParseUUIDPipe()) movieId: string) {
    return this.movieService.findById(movieId);
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  public async update(
    @Param('id', new ParseUUIDPipe()) movieId: string, @Body() updateMovieDto: UpdateMovieApiDto
  ) {
    return this.movieService.update({ ...updateMovieDto, movieId });
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id', new ParseUUIDPipe()) movieId: string) {
    return this.movieService.remove(movieId);
  }
}
