import { ApiProperty } from "@nestjs/swagger";

export class FindHallsItemResDto {
    @ApiProperty({ example: "f5a2260a-2e4f-4584-b21f-94dc1c2b8f07", description: "Unique identifier of the hall" })
    hallId: string;

    @ApiProperty({ example: 120, description: "Total number of seats in the hall" })
    amountOfSeats: number;

    @ApiProperty({ example: "Main Hall", description: "Visible name of the hall" })
    name: string;
}
