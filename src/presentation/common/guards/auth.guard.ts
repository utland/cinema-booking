import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from 'src/application/extrenal-services/ports/credential.service';
import { Payload } from 'src/application/common/models/payload.i';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CREDENTIAL_SERVICE_TOKEN)
    private credentialService: CredentialService,

    private reflector: Reflector
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
      const secret = process.env.JWT_SECRET;
      const payload: Payload = await this.credentialService.verify(token, secret);

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
