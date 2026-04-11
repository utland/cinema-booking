import { Query } from "@nestjs/cqrs";
import { HallListItemDto } from "../dtos/hall-list-item.dto";

export class FindHallAllQuery extends Query<HallListItemDto[]> {
    constructor() {
        super();
    }
}
