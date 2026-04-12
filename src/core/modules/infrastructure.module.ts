import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigType } from "../config/config.types";
import { TypeOrmUser } from "src/infrastructure/persistence/user/entities/typeorm-user.entity";
import { TypeOrmTicket } from "src/infrastructure/persistence/ticket/entities/typeorm-ticket.entity";
import { TypeOrmSession } from "src/infrastructure/persistence/session/entities/typeorm-session.entity";
import { TypeOrmMovie } from "src/infrastructure/persistence/movie/entities/typeorm-movie.entity";
import { TypeOrmHall } from "src/infrastructure/persistence/hall/entities/typeorm-hall.entity";
import { TypeOrmSeat } from "src/infrastructure/persistence/hall/entities/typeorm-seat.entity";
import { JwtModule } from "@nestjs/jwt";
import { IJwtConfig } from "../config/jwt.config";
import { CREDENTIAL_SERVICE_TOKEN } from "src/application/extrenal-services/ports/credential.service";
import { TokenService } from "src/infrastructure/external-services/adapters/token.service";
import { PASSWORD_SERVICE_TOKEN } from "src/application/extrenal-services/ports/password.service";
import { BcryptService } from "src/infrastructure/external-services/adapters/bcrypt.service";
import { NOTIFICATION_SERVICE_TOKEN } from "src/application/extrenal-services/ports/notification.service";
import { NodemailerService } from "src/infrastructure/external-services/adapters/nodemailer.service";
import { PAYMENT_SERVICE_TOKEN } from "src/application/extrenal-services/ports/payment.service";
import { StripeService } from "src/infrastructure/external-services/adapters/stripe.service";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => ({
              ...configService.get('database'),
              entities: [
                TypeOrmUser, 
                TypeOrmTicket, 
                TypeOrmSession, 
                TypeOrmMovie, 
                TypeOrmHall, 
                TypeOrmSeat
              ],
            }),
        }),
        
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => {
              const jwtConfig = configService.get('jwt') as IJwtConfig;
    
              return {
                secret: jwtConfig.secret,
                signOptions: {
                  expiresIn: jwtConfig.expiresIn as any,
                },
              };
            },
        }),
    ],
    providers: [
        {
          provide: CREDENTIAL_SERVICE_TOKEN,
          useClass: TokenService
        },
        {
          provide: PASSWORD_SERVICE_TOKEN,
          useClass: BcryptService
        },
        {
          provide: NOTIFICATION_SERVICE_TOKEN,
          useClass: NodemailerService
        },
        {
          provide: PAYMENT_SERVICE_TOKEN,
          useClass: StripeService
        },
    ],
    exports: [
      CREDENTIAL_SERVICE_TOKEN, 
      PASSWORD_SERVICE_TOKEN,
      NOTIFICATION_SERVICE_TOKEN,
      PAYMENT_SERVICE_TOKEN
    ]
})
export class InfrastructureModule {}