import { registerAs } from "@nestjs/config";

export interface ReadDatabaseConfig {
    url: string;
}

export const readDatabaseConfig = registerAs(
    "readDatabase",
    (): ReadDatabaseConfig => ({
        url: process.env.MONGODB_URL as string
    })
);