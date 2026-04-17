import { ApiProperty } from "@nestjs/swagger";

export class FindMovieResDto {
    @ApiProperty({ example: "The Matrix", description: "Movie title" })
    title: string;

    @ApiProperty({ example: 136, description: "Duration of the movie in minutes" })
    duration: number;

    @ApiProperty({ example: "A hacker discovers the true nature of reality.", description: "Movie description" })
    description: string;

    @ApiProperty({ example: "Sci-Fi", description: "Movie genre" })
    genre: string;

    @ApiProperty({
        example: "2026-05-01T18:30:00.000Z",
        type: String,
        format: "date-time",
        description: "Rental start date of the movie"
    })
    rentStart: Date;

    @ApiProperty({
        example: "2026-06-01T18:30:00.000Z",
        type: String,
        format: "date-time",
        description: "Rental end date of the movie"
    })
    rentEnd: Date;

    @ApiProperty({ example: "https://example.com/matrix.jpg", description: "Cover image URL for the movie" })
    photoUrl: string;
}
