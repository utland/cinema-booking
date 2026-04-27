import { Hall } from "@app/catalog/domain/hall/models/hall.entity";
import { HallListItemDto } from "../hall-list-item.dto";

export const toHallListDto = (halls: Hall[]): HallListItemDto[] => {
    return halls.map((hall) => ({
        name: hall.name,
        hallId: hall.id,
        amountOfSeats: hall.seats.length
    }));
};
