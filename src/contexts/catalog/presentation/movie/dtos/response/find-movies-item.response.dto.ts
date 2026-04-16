import { ApiProperty } from "@nestjs/swagger";

export class FindMoviesItemResDto {
    @ApiProperty({ example: "f421d2e3-0abc-4b4b-a5bb-1234567890ab", description: "Unique identifier of the movie" })
    movieId: string;

    @ApiProperty({ example: "The Matrix", description: "Movie title" })
    name: string;

    @ApiProperty({ example: "https://example.com/matrix.jpg", description: "Cover image URL for the movie" })
    photoUrl: string;

    @ApiProperty({ example: "2026-05-01T18:30:00.000Z", type: String, format: "date-time", description: "Rental start date of the movie" })
    rentStart: Date;

    @ApiProperty({ example: "2026-06-01T18:30:00.000Z", type: String, format: "date-time", description: "Rental end date of the movie" })
    rentEnd: Date;
}
