import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUserByIdQuery } from "./find-user-by-id.query";
import { Inject, NotFoundException } from "@nestjs/common";
import { USER_READ_REPOSITORY_TOKEN, type UserReadRepository } from "../../ports/user.read-repository";
import { UserProfileDto } from "../dtos/user-profile.dto";

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
    constructor(
        @Inject(USER_READ_REPOSITORY_TOKEN)
        private readonly userReadRepository: UserReadRepository
    ) {}

    async execute({ userId }: FindUserByIdQuery): Promise<UserProfileDto> {
        const user = await this.userReadRepository.getProfile(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        return user;
    }
}
