import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appSchema } from './config/schema';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/presentation/common/guards/auth.guard';
import { RolesGuard } from 'src/presentation/common/guards/role.guard';
import { InfrastructureModule } from './modules/infrastructure.module';
import { HallModule } from './modules/hall.module';
import { MovieModule } from './modules/movie.module';
import { SessionModule } from './modules/session.module';
import { TicketModule } from './modules/ticket.module';
import { UserModule } from './modules/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { NotFoundDomainException } from 'src/domain/common/exceptions/not-found.exception';
import { BadRequestDomainException } from 'src/domain/common/exceptions/bad-request.exception';
import { ConflictDomainException } from 'src/domain/common/exceptions/conflict.exception';
import { ForbiddenDomainException } from 'src/domain/common/exceptions/forbidden.exception';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: appSchema,
      load: [databaseConfig, jwtConfig],
    }),

    CqrsModule.forRoot(),

    InfrastructureModule,
    HallModule,
    MovieModule,
    SessionModule,
    TicketModule,
    UserModule
  ],
  providers: [
    { 
      provide: APP_GUARD, 
      useClass: AuthGuard 
    }, 
    { 
      provide: APP_GUARD, 
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundDomainException
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestDomainException
    },
    {
      provide: APP_FILTER,
      useClass: ConflictDomainException
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenDomainException
    },
  ]
})
export class AppModule {}
