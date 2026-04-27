import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@app/shared-kernel/presentation/decorators/public.decorator";
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from "@app/identity/domain/ports/credential.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(CREDENTIAL_SERVICE_TOKEN)
        private readonly credentialService: CredentialService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException("Token is absent");
        }

        try {
            const payload = await this.credentialService.verify(token);
            request["user"] = payload;

            return true;
        } catch {
            throw new UnauthorizedException("Token is invalid");
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
