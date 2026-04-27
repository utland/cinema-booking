import { registerAs } from "@nestjs/config";

export interface NodemailerConfig {
    token: string;
}

export const nodemailerConfig = registerAs(
    "nodemailer",
    (): NodemailerConfig => ({
        token: process.env.NODEMAILER_TOKEN as string
    })
);
