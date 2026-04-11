import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("login")
    public async signIn(@Body() signInDto: SignInDto) {
        return await this.authService.validate(signInDto);
    }

    @Public()
    @Post("register")
    public async signUp(@Body() signUpDto: SignUpDto) {
        return await this.authService.register(signUpDto);
    }
}
