import { TypeOrmModule } from "@nestjs/typeorm";
import { IRabbitMqConfig } from "./rabbitmq.config";
import { ReadDatabaseConfig } from "./read-database.config";

export interface ConfigType {
    database: TypeOrmModule;
    readDatabase: ReadDatabaseConfig;
    rabbitmq: IRabbitMqConfig;
}
