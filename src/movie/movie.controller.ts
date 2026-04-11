import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/common/decorators/role.decorator";

@Controller("movie")
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.movieService.create(createMovieDto);
    }

    @Roles(Role.ADMIN)
    @Get("all")
    public async findAll() {
        return this.movieService.findAll();
    }

    @Get()
    public async findByRentDate() {
        return this.movieService.findByRentDate();
    }

    @Get("/:id")
    public async findOne(@Param("id") id: string) {
        return this.movieService.findById(id);
    }

    @Roles(Role.ADMIN)
    @Patch("/:id")
    public async update(@Param("id") id: string, @Body() updateMovieDto: UpdateMovieDto) {
        return this.movieService.update(id, updateMovieDto);
    }

    @Roles(Role.ADMIN)
    @Delete("/:id")
    public async remove(@Param("id") id: string) {
        return this.movieService.remove(id);
    }
}
