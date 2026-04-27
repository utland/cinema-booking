import { NodemailerConfig } from "./nodemailer.config";
import { IRabbitMqConfig } from "./rabbitmq.config";

export interface ConfigType {
    nodemailer: NodemailerConfig;
    rabbitmq: IRabbitMqConfig;
}
