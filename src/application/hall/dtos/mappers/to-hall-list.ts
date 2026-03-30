import { Hall } from "src/domain/hall/models/hall.entity";
import { HallListItemDto } from "../response/hall-list-item.dto";

export const toHallListDto = (halls: Hall[]): HallListItemDto[] => {
    return halls.map(hall => ({
        name: hall.name,
        hallId: hall.id,
        amountOfSeats: hall.seats.length
    }));
}