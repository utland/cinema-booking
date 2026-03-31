import { Query } from "@nestjs/cqrs";
import { HallEditorDto } from "../dtos/hall-editor.dto";

export class FindHallByIdQuery extends Query<HallEditorDto> {
    constructor(public readonly hallId: string) {
        super();
    }
}