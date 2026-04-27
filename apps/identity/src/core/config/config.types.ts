import { TypeOrmModule } from "@nestjs/typeorm";
import { IJwtConfig } from "./jwt.config";
import { IRabbitMqConfig } from "./rabbitmq.config";

export interface ConfigType {
    database: TypeOrmModule;
    jwt: IJwtConfig;
    rabbitmq: IRabbitMqConfig;
}
