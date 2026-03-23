import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.types';
import { IJwtConfig } from 'src/config/jwt.config';
import { IPayload } from '../interfaces/payload.i';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService<ConfigType>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is absent');
    }

    try {
      const payload: IPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt').secret,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
