import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appSchema } from './config/schema';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/presentation/common/guards/auth.guard';
import { RolesGuard } from 'src/presentation/common/guards/role.guard';
import { InfrastructureModule } from './modules/infrastructure.module';
import { HallModule } from './modules/hall.module';
import { MovieModule } from './modules/movie.module';
import { SessionModule } from './modules/session.module';
import { TicketModule } from './modules/ticket.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: appSchema,
      load: [databaseConfig, jwtConfig],
    }),

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
    }
  ]
})
export class AppModule {}
