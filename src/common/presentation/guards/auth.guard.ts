import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IdentityApi } from "src/contexts/identity/api/indentity-api";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private identityApi: IdentityApi,
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

        const payload = await this.identityApi.checkToken(token);
        if (!payload) throw new UnauthorizedException("Token is invalid");

        request["user"] = payload;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
