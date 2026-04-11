import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { CommonModule } from "./modules/common.module";
import { CatalogModule } from "./modules/catalog.module";
import { BookingModule } from "./modules/booking.module";
import { IdentityModule } from "./modules/identity.module";
import { NotificationsModule } from "./modules/notifications.module";
import { AuthGuard } from "src/common/presentation/guards/auth.guard";
import { RolesGuard } from "src/common/presentation/guards/role.guard";
import { DomainExceptionFilter } from "src/common/application/nest-filters/domain-exception.filter";

@Module({
    imports: [CommonModule, CatalogModule, BookingModule, IdentityModule, NotificationsModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        },
        {
            provide: APP_FILTER,
            useClass: DomainExceptionFilter
        }
    ]
})
export class AppModule {}
