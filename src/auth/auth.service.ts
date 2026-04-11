import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { UserService } from "src/user/user.service";
import { IPayload } from "src/common/interfaces/payload.i";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "src/config/config.types";
import { IJwtConfig } from "src/config/jwt.config";
import { PasswordService } from "src/common/services/password.service";

export interface SignInResponse {
    accessToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<ConfigType>,
        private readonly passwordService: PasswordService
    ) {}

    public async validate(signInDto: SignInDto): Promise<SignInResponse> {
        const user = await this.userService.findByLogin(signInDto.login);

        const isPasswordEqual = await this.passwordService.isEqual(signInDto.password, user.password);
        if (!isPasswordEqual) throw new NotAcceptableException("Password is wrong");

        const payload: IPayload = { id: user.id, role: user.role };

        const secret = this.configService.get<IJwtConfig>("jwt")?.secret as string;
        const accessToken = await this.jwtService.signAsync(payload, { secret });

        return { accessToken };
    }

    public async register(signUpDto: SignUpDto): Promise<void> {
        const { login, password, email } = signUpDto;
        await this.userService.checkExisted(login, email);

        const hashedPassword = await this.passwordService.encrypt(password);
        await this.userService.create({ ...signUpDto, password: hashedPassword });
    }
}
