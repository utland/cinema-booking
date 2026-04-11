import { SeatBooking } from "../models/seat-booking";
import { SessionBooking } from "../models/session-booking";

export const CATALOG_GATEWAY = "CatalogGateway";

export interface CatalogBookingGateway {
    getSession(sessionId: string): Promise<SessionBooking | null>;
    getSeats(hallId: string): Promise<SeatBooking[] | null>;
}
