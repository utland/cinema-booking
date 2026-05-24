import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { Payload } from "@app/shared-kernel/interfaces/payload.i";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly amqpConnection: AmqpConnection,
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

        if (!token) throw new UnauthorizedException("Token is absent");

        const payload = await this.amqpConnection
            .request<Payload | null>({
                exchange: "domain_events",
                routingKey: "check_token",
                payload: { token }
            })
            .catch(() => {
                throw new InternalServerErrorException("IdentityService is unavailable");
            });

        if (!payload) throw new UnauthorizedException("Token is invalid");

        request["user"] = payload;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
