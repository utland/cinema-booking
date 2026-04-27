import { Inject, Injectable } from "@nestjs/common";
import { CatalogBookingMapper } from "./catalog.mapper";
import { CatalogBookingGateway } from "@app/booking/domain/ports/catalog-booking.port";
import { SessionBooking } from "@app/booking/domain/models/session-booking";
import { SeatBooking } from "@app/booking/domain/models/seat-booking";
import { ClientProxy } from "@nestjs/microservices";
import { CATALOG_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { firstValueFrom } from "rxjs";
import { HallCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/hall-catalog.dto";
import { SessionCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/session-catalog.dto";

@Injectable()
export class CatalogBookingAdapter implements CatalogBookingGateway {
    constructor(
        @Inject(CATALOG_SERVICE_TOKEN)
        private readonly catalogClient: ClientProxy,
        private readonly catalogMapper: CatalogBookingMapper
    ) {}

    public async getSession(sessionId: string): Promise<SessionBooking | null> {
        const res = this.catalogClient.send<SessionCatalogDto | null>({ cmd: "get_session_info" }, { sessionId });

        const sessionCatalog = await firstValueFrom(res);
        if (!sessionCatalog) return null;

        return this.catalogMapper.toSessionBooking(sessionCatalog);
    }

    public async getSeats(hallId: string): Promise<SeatBooking[] | null> {
        const res = this.catalogClient.send<HallCatalogDto>({ cmd: "get_hall_info" }, { hallId });

        const hallCatalog = await firstValueFrom(res);
        if (!hallCatalog) return null;

        return this.catalogMapper.toSeatsBooking(hallCatalog);
    }
}
