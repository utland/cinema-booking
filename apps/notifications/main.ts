import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { NotificationsModule } from "./src/core/notifications.module";

async function bootstrap() {
    const app = await NestFactory.create(NotificationsModule);

    await app.listen(process.env.APP_PORT as string);
}

bootstrap();
