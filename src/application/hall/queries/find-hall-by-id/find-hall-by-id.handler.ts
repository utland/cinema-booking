import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindHallByIdQuery } from "./find-hall-by-id.query";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";
import { HallEditorDto } from "../dtos/hall-editor.dto";
import { toHallEditorDto } from "../dtos/mappers/to-hall-editor.mapper";

@QueryHandler(FindHallByIdQuery)
export class FindHallByIdHandler implements IQueryHandler<FindHallByIdQuery>{
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository
    ) {}

    public async execute({ hallId }: FindHallByIdQuery): Promise<HallEditorDto> {
        const hall = await this.hallRepo.findById(hallId);
        if (!hall) throw new NotFoundException("This hall doesn't exist");

        const dto = toHallEditorDto(hall);
        return dto;
    }
}