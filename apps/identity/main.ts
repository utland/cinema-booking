import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { IdentityModule } from "./src/core/identity.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(IdentityModule);
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Cinema Identity API")
        .setDescription("API for managing cinema users")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    await app.listen(process.env.APP_PORT as string);
}

bootstrap();
