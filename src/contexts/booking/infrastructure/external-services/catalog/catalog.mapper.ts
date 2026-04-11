import { Injectable } from "@nestjs/common";
import { SeatBooking } from "src/contexts/booking/domain/models/seat-booking";
import { SessionBooking } from "src/contexts/booking/domain/models/session-booking";
import { HallCatalogDto } from "src/contexts/catalog/api/dto/hall-catalog.dto";
import { SessionCatalogDto } from "src/contexts/catalog/api/dto/session-catalog.dto";

@Injectable()
export class CatalogBookingMapper {
    public toSessionBooking({ price, startTime }: SessionCatalogDto): SessionBooking {
        const sessionBooking = new SessionBooking(price, startTime);
        return sessionBooking;
    }

    public toSeatsBooking({ seats }: HallCatalogDto): SeatBooking[] {
        const seatsBooking = seats.map((item) => {
            return new SeatBooking(item.id, item.row, item.column);
        });

        return seatsBooking;
    }
}
