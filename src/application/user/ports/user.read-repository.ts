import { UserProfileDto } from "../queries/dtos/user-profile.dto";

export const USER_READ_REPOSITORY_TOKEN = "UserReadRepository";

export interface UserReadRepository {
    getProfile(userId: string): Promise<UserProfileDto | null>;
}