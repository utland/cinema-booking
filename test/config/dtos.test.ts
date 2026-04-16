import { HallType } from "src/contexts/catalog/domain/hall/models/hall.entity";
import { CreateHallReqDto } from "src/contexts/catalog/presentation/hall/dtos/request/create-hall.request.dto";
import { CreateMovieReqDto } from "src/contexts/catalog/presentation/movie/dtos/request/create-movie.request.dto";
import { CreateSessionReqDto } from "src/contexts/catalog/presentation/session/dtos/request/create-session.request.dto";
import { CreateUserReqDto } from "src/contexts/identity/presentation/dtos/request/create-user.request.dto";

export type tokenName = "user" | "admin";

export interface ITestPayload {
    token: string;
    id: string;
    login: string;
}

export const userTest: CreateUserReqDto = {
    email: "test0@email.com",
    password: "0000",
    login: "user",
    firstName: "test",
    lastName: "test"
};

export const adminTest: CreateUserReqDto = {
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

export const movieTest: CreateMovieReqDto = {
    title: "Test Movie",
    description: "Test Description",
    duration: 120,
    genre: "Action",
    rentStart: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    rentEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

export const sessionTest: CreateSessionReqDto = {
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    finishTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    bookingTime: new Date(),
    basePrice: 200,
    movieId: "",
    hallId: ""
};
