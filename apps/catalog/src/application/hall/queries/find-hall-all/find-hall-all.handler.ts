import { Inject, Injectable } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindHallAllQuery } from "./find-hall-all.query";
import { HallListItemDto } from "../dtos/hall-list-item.dto";
import { toHallListDto } from "../dtos/mappers/to-hall-list.mapper";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "@app/catalog/domain/hall/ports/hall.repository";

@QueryHandler(FindHallAllQuery)
export class FindAllHallHandler implements IQueryHandler<FindHallAllQuery> {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository
    ) {}

    public async execute(): Promise<HallListItemDto[]> {
        const halls = await this.hallRepo.findAll();

        const dto = toHallListDto(halls);
        return dto;
    }
}
