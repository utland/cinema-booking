import { SeatBooking } from "@app/booking/domain/models/seat-booking";
import { SessionBooking } from "@app/booking/domain/models/session-booking";
import { HallCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/hall-catalog.dto";
import { SessionCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/session-catalog.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CatalogBookingMapper {
    public toSessionBooking({ price, startTime, id, bookingTime }: SessionCatalogDto): SessionBooking {
        const sessionBooking = new SessionBooking(id, price, startTime, bookingTime);
        return sessionBooking;
    }

    public toSeatsBooking({ seats }: HallCatalogDto): SeatBooking[] {
        const seatsBooking = seats.map((item) => {
            return new SeatBooking(item.id, item.row, item.column);
        });

        return seatsBooking;
    }
}
