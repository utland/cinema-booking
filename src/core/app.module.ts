import { Module } from "@nestjs/common";
import { CommonModule } from "./modules/common.module";
import { CatalogModule } from "./modules/catalog.module";
import { BookingModule } from "./modules/booking.module";
import { IdentityModule } from "./modules/identity.module";
import { NotificationsModule } from "./modules/notifications.module";

@Module({
    imports: [CommonModule, CatalogModule, BookingModule, IdentityModule, NotificationsModule]
})
export class AppModule {}
