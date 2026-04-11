import { User } from "../models/user.entity";

export const USER_REPOSITORY_TOKEN = "UserRepository";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByLogin(login: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}
