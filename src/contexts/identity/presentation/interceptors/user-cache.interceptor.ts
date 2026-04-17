import { CacheInterceptor } from "@nestjs/cache-manager";
import { ExecutionContext } from "@nestjs/common";
import { Payload } from "src/common/interfaces/payload.i";

export class UserCacheInterceptor extends CacheInterceptor {
    public trackBy(context: ExecutionContext): string | undefined {
        const key = super.trackBy(context);

        if (!key) {
            return undefined;
        }

        const { id } = context.switchToHttp().getRequest().user as Payload;

        return `user:${id}:profile`;
    }
}
