import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "@app/identity/core/config/config.types";
import { IJwtConfig } from "@app/identity/core/config/jwt.config";
import { CredentialService } from "@app/identity/domain/ports/credential.service";
import { Payload } from "@app/shared-kernel/interfaces/payload.i";

@Injectable()
export class TokenService implements CredentialService {
    private secret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<ConfigType>
    ) {
        const { secret } = this.configService.get("jwt") as IJwtConfig;
        this.secret = secret;
    }

    public async generate(payload: Payload): Promise<string> {
        const token = await this.jwtService.signAsync(payload, { secret: this.secret });
        return token;
    }

    public async verify(token: string): Promise<Payload> {
        const payload = await this.jwtService.verifyAsync(token, { secret: this.secret });
        return payload;
    }
}
