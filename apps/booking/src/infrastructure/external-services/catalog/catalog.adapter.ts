import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CatalogBookingMapper } from "./catalog.mapper";
import { CatalogBookingGateway } from "@app/booking/domain/ports/catalog-booking.port";
import { SessionBooking } from "@app/booking/domain/models/session-booking";
import { SeatBooking } from "@app/booking/domain/models/seat-booking";
import { HallCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/hall-catalog.dto";
import { SessionCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/session-catalog.dto";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class CatalogBookingAdapter implements CatalogBookingGateway {
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly catalogMapper: CatalogBookingMapper
    ) {}

    public async getSession(sessionId: string): Promise<SessionBooking | null> {
        const sessionCatalog = await this.amqpConnection.request<SessionCatalogDto | null>({
            exchange: "domain_events",
            routingKey: "get_session_info",
            payload: { sessionId }
        });

        if (!sessionCatalog) return null;

        return this.catalogMapper.toSessionBooking(sessionCatalog);
    }

    public async getSeats(hallId: string): Promise<SeatBooking[] | null> {
        const hallCatalog = await this.amqpConnection.request<HallCatalogDto | null>({
            exchange: "domain_events",
            routingKey: "get_hall_info",
            payload: { hallId }
        });

        if (!hallCatalog) return null;

        return this.catalogMapper.toSeatsBooking(hallCatalog);
    }
}
