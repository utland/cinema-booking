import { Hall } from "src/contexts/catalog/domain/hall/models/hall.entity";
import { HallEditorDto } from "../hall-editor.dto";

export const toHallEditorDto = (hall: Hall): HallEditorDto => {
    return {
        name: hall.name,
        type: hall.type,
        seats: hall.seats
    };
};
