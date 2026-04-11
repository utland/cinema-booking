export class SeatCatalogDto {
    id: string;
    row: number;
    column: number;
}

export class HallCatalogDto {
    name: string;
    seats: SeatCatalogDto[];
}
