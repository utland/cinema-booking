import { HallType } from "src/contexts/catalog/domain/hall/models/hall.entity";
import { CreateUserApiDto } from "src/contexts/identity/presentation/dtos/create-user-api.dto";

export type tokenName = "user" | "admin";

export interface ITestPayload {
    token: string;
    id: string;
    login: string;
}

export const userTest: CreateUserApiDto = {
    email: "test0@email.com",
    password: "0000",
    login: "user",
    firstName: "test",
    lastName: "test"
};

export const adminTest: CreateUserApiDto = {
    email: "test2@email.com",
    password: "0000",
    login: "admin",
    firstName: "test",
    lastName: "test"
};

export const hallTest = {
    name: "Test Hall",
    type: HallType.STANDART
};

export const movieTest = {
    title: "Test Movie",
    description: "Test Description",
    duration: 120,
    genre: "Action",
    rentStart: new Date(),
    rentEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

export const sessionTest = {
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    finishTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    basePrice: 200,
    movieId: "",
    hallId: ""
};
