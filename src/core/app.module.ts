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
import { NotFoundExceptionFilter } from 'src/presentation/common/filters/not-found.filter';
import { BadRequestExceptionFilter } from 'src/presentation/common/filters/bad-request.filter';
import { ConflictExceptionFilter } from 'src/presentation/common/filters/conflict.filter';

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
      useClass: NotFoundExceptionFilter,
    },
    { 
      provide: APP_FILTER, 
      useClass: BadRequestExceptionFilter,
    },
    { 
      provide: APP_FILTER, 
      useClass: ConflictExceptionFilter,
    }
  ]
})
export class AppModule {}
