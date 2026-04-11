import { Injectable } from "@nestjs/common";
import { SeatBooking } from "src/contexts/booking/domain/models/seat-booking";
import { SessionBooking } from "src/contexts/booking/domain/models/session-booking";
import { CatalogBookingGateway } from "src/contexts/booking/domain/ports/catalog-booking.port";
import { CatalogApi } from "src/contexts/catalog/api/catalog-api";
import { CatalogBookingMapper } from "./catalog.mapper";

@Injectable()
export class CatalogBookingAdapter implements CatalogBookingGateway {
    constructor(
        private readonly catalogApi: CatalogApi,
        private readonly catalogMapper: CatalogBookingMapper
    ) {}

    public async getSession(sessionId: string): Promise<SessionBooking | null> {
        const sessionCatalog = await this.catalogApi.getSessionInfo(sessionId);
        if (!sessionCatalog) return null;

        return this.catalogMapper.toSessionBooking(sessionCatalog);
    }

    public async getSeats(hallId: string): Promise<SeatBooking[] | null> {
        const hallCatalog = await this.catalogApi.getHallInfo(hallId);
        if (!hallCatalog) return null;

        return this.catalogMapper.toSeatsBooking(hallCatalog);
    }
}
