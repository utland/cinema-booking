import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CredentialService } from "src/application/common/ports/credential.service";

@Injectable()
export class TokenService implements CredentialService {
    constructor (
        private readonly jwtService: JwtService
    ) {}

    public async generate(payload: any, secret?: string | undefined): Promise<string> {
        const token = await this.jwtService.signAsync(payload, { secret });
        return token;
    }

    public async verify(token: string, secret?: string | undefined): Promise<any> {
        const payload = await this.jwtService.verifyAsync(token, { secret });
        return payload;
    }

}