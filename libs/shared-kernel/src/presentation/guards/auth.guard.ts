import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IDENTITY_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { Payload } from "@app/shared-kernel/interfaces/payload.i";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(IDENTITY_SERVICE_TOKEN)
        private identityClient: ClientProxy,
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

        const res = this.identityClient.send<Payload | null>({ cmd: "check_token" }, token);

        const payload = await firstValueFrom(res);
        if (!payload) throw new UnauthorizedException("Token is invalid");

        request["user"] = payload;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
