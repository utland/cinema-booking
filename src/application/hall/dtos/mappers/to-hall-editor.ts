import { Hall } from "src/domain/hall/models/hall.entity";
import { HallEditorDto } from "../response/hall-editor.dto";

export const toHallEditorDto = (hall: Hall): HallEditorDto => {
    return {
        name: hall.name,
        type: hall.type,
        seats: hall.seats
    }
}