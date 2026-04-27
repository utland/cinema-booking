import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { NotificationsModule } from "./src/core/notifications.module";

async function bootstrap() {
    const app = await NestFactory.create(NotificationsModule);
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Cinema Catalog API")
        .setDescription("API for managing cinema catalog")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL as string],
            queue: "booking_queue"
        }
    });

    await app.startAllMicroservices();
}
bootstrap();
