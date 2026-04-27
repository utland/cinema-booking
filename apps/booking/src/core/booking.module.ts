import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { bookingSchema } from "./config/schema";
import { databaseConfig } from "./config/database.config";
import { stripeConfig } from "./config/stripe.config";
import { CqrsModule } from "@nestjs/cqrs";
import { TicketController } from "../presentation/ticket.controller";
import { TicketFactory } from "../domain/factories/ticket.factory";
import { CalculateTicketPriceService } from "../domain/domain-services/calculate-ticket-price.service";
import { TypeOrmTicketMapper } from "../infrastructure/persistence/typeorm-ticket.mapper";
import { TICKET_REPOSITORY_TOKEN } from "../domain/ports/ticket.repository";
import { TypeOrmTicketRepository } from "../infrastructure/persistence/typeorm-ticket.repository";
import { TypeOrmTicket } from "../infrastructure/persistence/typeorm-ticket.entity";
import { ConfigType } from "./config/config.types";
import { CreateTicketHandler } from "../application/commands/create-ticket/create-ticket.handler";
import { DeleteTicketHandler } from "../application/commands/delete-ticket/delete-ticket.handler";
import { CancelTicketHandler } from "../application/commands/cancel-ticket/cancel-ticket.handler";
import { PayTicketHandler } from "../application/commands/pay-ticket/pay-ticket.handler";
import { StripeFacade } from "../infrastructure/external-services/stripe/stripe.facade";
import { StripeMapper } from "../infrastructure/external-services/stripe/stripe.mapper";
import { PAYMENT_SERVICE_TOKEN } from "../application/ports/payment.service";
import { StripePaymentService } from "../infrastructure/external-services/stripe/stripe.adapter";
import { CatalogBookingAdapter } from "../infrastructure/external-services/catalog/catalog.adapter";
import { CATALOG_GATEWAY } from "../domain/ports/catalog-booking.port";
import { CatalogBookingMapper } from "../infrastructure/external-services/catalog/catalog.mapper";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { BadRequestExceptionFilter } from "@app/shared-kernel/presentation/filters/bad-request.filter";
import { NotFoundExceptionFilter } from "@app/shared-kernel/presentation/filters/not-found.filter";
import { ForbiddenExceptionFilter } from "@app/shared-kernel/presentation/filters/forbidden.filter";
import { ConflictExceptionFilter } from "@app/shared-kernel/presentation/filters/conflict.filter";
import { AuthGuard } from "@app/shared-kernel/presentation/guards/auth.guard";
import { RolesGuard } from "@app/shared-kernel/presentation/guards/role.guard";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CATALOG_SERVICE_TOKEN, IDENTITY_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { rabbitmqConfig } from "./config/rabbitmq.config";

const commands = [CreateTicketHandler, DeleteTicketHandler, CancelTicketHandler, PayTicketHandler];

const stripeAcl = [StripeFacade, StripeMapper, { provide: PAYMENT_SERVICE_TOKEN, useClass: StripePaymentService }];

const catalogAcl = [CatalogBookingMapper, { provide: CATALOG_GATEWAY, useClass: CatalogBookingAdapter }];

const filters = [
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: ConflictExceptionFilter }
];

const guards = [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: bookingSchema,
            envFilePath: "apps/booking/.env",
            load: [databaseConfig, stripeConfig, rabbitmqConfig]
        }),

        CqrsModule.forRoot(),

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
        ]),

        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                name: CATALOG_SERVICE_TOKEN,
                useFactory: (configService: ConfigService<ConfigType>) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get("rabbitmq").url],
                        queue: "catalog_queue",
                        queueOptions: {
                            durable: true
                        }
                    }
                }),
                inject: [ConfigService]
            }
        ]),

        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                name: "RABBITMQ_SERVICE",
                useFactory: (configService: ConfigService<ConfigType>) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get("rabbitmq").url],
                        queue: "booking_events",
                        queueOptions: {
                            durable: false
                        }
                    }
                }),
                inject: [ConfigService]
            }
        ]),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => ({
                ...configService.get("database"),
                entities: [TypeOrmTicket]
            })
        }),

        TypeOrmModule.forFeature([TypeOrmTicket])
    ],
    controllers: [TicketController],
    providers: [
        TicketFactory,
        TypeOrmTicketMapper,
        CalculateTicketPriceService,
        { provide: TICKET_REPOSITORY_TOKEN, useClass: TypeOrmTicketRepository },
        ...commands,
        ...stripeAcl,
        ...catalogAcl,
        ...filters,
        ...guards
    ]
})
export class BookingModule {}
