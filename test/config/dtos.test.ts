import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { HallType } from "src/hall/entities/hall.entity";
import { CreateMovieDto } from "src/movie/dto/create-movie.dto";
import { CreateSessionDto } from "src/session/dto/create-session.dto";

export type tokenName = "user" | "admin";

export interface ITestPayload {
    token: string;
    id: string;
    login: string;
}

export const userTest: SignUpDto = {
    email: 'test0@email.com',
    password: '0000',
    login: 'user',
    firstName: 'test',
    lastName: 'test',
    phoneNumber: '+3800000000',
};

export const adminTest: SignUpDto = {
    email: 'test2@email.com',
    password: '0000',
    login: 'admin',
    firstName: 'test',
    lastName: 'test',
    phoneNumber: '+3800000000',
};

export const hallTest = { 
    name: 'Test Hall', 
    type: HallType.STANDART 
}

export const movieTest: CreateMovieDto = { 
    title: 'Test Movie', 
    description: 'Test Description', 
    duration: 120, 
    genre: 'Action', 
    rentStart: new Date(),
    rentEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

export const sessionTest: CreateSessionDto = {
    startTime: new Date(),
    finishTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    basePrice: 200,
    movieId: "",
    hallId: ""
}