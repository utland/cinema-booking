export class UpdateMovieDto {
    movieId: string;
    title: string;
    duration: number;
    description: string;
    genre: string;
    rentStart: Date;
    rentEnd: Date;
}