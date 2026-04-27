import { TypeOrmModule } from "@nestjs/typeorm";
import { IStripeConfig } from "./stripe.config";
import { IRabbitMqConfig } from "./rabbitmq.config";

export interface ConfigType {
    database: TypeOrmModule;
    stripe: IStripeConfig;
    rabbitmq: IRabbitMqConfig;
}
