import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.types';
import { IJwtConfig } from 'src/config/jwt.config';
import { UserModule } from 'src/user/user.module';
import { PasswordService } from 'src/common/services/password.service';

@Module({
  imports: [
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
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
