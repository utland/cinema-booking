import { Hall } from "../models/hall.entity";

export const HALL_REPOSITORY_TOKEN = "HallRepository";

export interface HallRepository {
    findById(id: string): Promise<Hall | null>;
    findAll(): Promise<Hall[]>;
    save(hall: Hall): Promise<void>;
    delete(hall: Hall): Promise<void>;
}