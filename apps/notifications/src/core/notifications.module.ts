import { Module } from "@nestjs/common";
import { USER_NOTIFICATIONS_GATEWAY } from "../domain/user-notifications.port";
import { UserNotificationAdapter } from "../infrastructure/user-notifications/user-notifications.adapter";
import { UserNotificationsMapper } from "../infrastructure/user-notifications/user-notifications.mapper";
import { NotificationService } from "../application/notifications.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SENDER_SERVICE_TOKEN } from "../application/ports/sender.port";
import { NodemailerService } from "../infrastructure/adapters/nodemailer.service";
import { notificationsSchema } from "./config/schema";
import { nodemailerConfig } from "./config/nodemailer.config";
import { rabbitmqConfig } from "./config/rabbitmq.config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { IDENTITY_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { ConfigType } from "./config/config.types";
import { config } from "process";

const identityAcl = [
    { provide: USER_NOTIFICATIONS_GATEWAY, useClass: UserNotificationAdapter },
    UserNotificationsMapper
];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: notificationsSchema,
            envFilePath: "apps/notifications/.env",
            load: [nodemailerConfig, rabbitmqConfig]
        }),

        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                name: IDENTITY_SERVICE_TOKEN,
                useFactory: (configService: ConfigService<ConfigType>) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get("rabbitmq").url],
                        queue: "identity_queue",
                        queueOptions: {
                            durable: true
                        }
                    }
                }),
                inject: [ConfigService]
            }
        ])
    ],
    providers: [NotificationService, { provide: SENDER_SERVICE_TOKEN, useClass: NodemailerService }, ...identityAcl]
})
export class NotificationsModule {}
