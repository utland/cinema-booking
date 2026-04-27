import { TypeOrmModule } from "@nestjs/typeorm";
import { IRabbitMqConfig } from "./rabbitmq.config";

export interface ConfigType {
    database: TypeOrmModule;
    rabbitmq: IRabbitMqConfig;
}
