import { registerAs } from "@nestjs/config";

export interface IRabbitMqConfig {
    url: string;
}

export const rabbitmqConfig = registerAs(
    "rabbitmq",
    (): IRabbitMqConfig => ({
        url: process.env.RABBITMQ_URL as string
    })
);
