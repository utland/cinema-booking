import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CancelTicketHandler } from "src/contexts/booking/application/commands/cancel-ticket/cancel-ticket.handler";
import { CreateTicketHandler } from "src/contexts/booking/application/commands/create-ticket/create-ticket.handler";
import { DeleteTicketHandler } from "src/contexts/booking/application/commands/delete-ticket/delete-ticket.handler";
import { PayTicketHandler } from "src/contexts/booking/application/commands/pay-ticket/pay-ticket.handler";
import { PAYMENT_SERVICE_TOKEN } from "src/contexts/booking/application/ports/payment.service";
import { BookingApi } from "src/contexts/booking/booking-api";
import { TicketFactory } from "src/contexts/booking/domain/factories/ticket.factory";
import { CATALOG_GATEWAY } from "src/contexts/booking/domain/ports/catalog-booking.port";
import { TICKET_REPOSITORY_TOKEN } from "src/contexts/booking/domain/ports/ticket.repository";
import { CatalogBookingAdapter } from "src/contexts/booking/infrastructure/external-services/catalog/catalog.adapter";
import { CatalogBookingMapper } from "src/contexts/booking/infrastructure/external-services/catalog/catalog.mapper";
import { StripePaymentService } from "src/contexts/booking/infrastructure/external-services/stripe/stripe.adapter";
import { StripeFacade } from "src/contexts/booking/infrastructure/external-services/stripe/stripe.facade";
import { StripeMapper } from "src/contexts/booking/infrastructure/external-services/stripe/stripe.mapper";
import { TypeOrmTicket } from "src/contexts/booking/infrastructure/persistence/typeorm-ticket.entity";
import { TypeOrmTicketMapper } from "src/contexts/booking/infrastructure/persistence/typeorm-ticket.mapper";
import { TicketController } from "src/contexts/booking/presentation/ticket.controller";
import { CatalogModule } from "./catalog.module";
import { TypeOrmTicketRepository } from "src/contexts/booking/infrastructure/persistence/typeorm-ticket.repository";
import { CalculateTicketPriceService } from "src/contexts/booking/domain/domain-services/calculate-ticket-price.service";

const commands = [CreateTicketHandler, DeleteTicketHandler, CancelTicketHandler, PayTicketHandler];

const stripeAcl = [StripeFacade, StripeMapper, { provide: PAYMENT_SERVICE_TOKEN, useClass: StripePaymentService }];

const catalogAcl = [CatalogBookingMapper, { provide: CATALOG_GATEWAY, useClass: CatalogBookingAdapter }];

@Module({
    imports: [TypeOrmModule.forFeature([TypeOrmTicket]), CatalogModule],
    controllers: [TicketController],
    providers: [
        BookingApi,
        TicketFactory,
        TypeOrmTicketMapper,
        CalculateTicketPriceService,
        { provide: TICKET_REPOSITORY_TOKEN, useClass: TypeOrmTicketRepository },
        ...commands,
        ...stripeAcl,
        ...catalogAcl
    ],
    exports: [BookingApi]
})
export class BookingModule {}
