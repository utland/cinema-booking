import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PasswordService } from "../common/services/password.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { Role } from "../common/enums/role.enum";
import { ConflictException, NotAcceptableException } from "@nestjs/common";

describe("AuthService", () => {
    let service: AuthService;
    let userService: jest.Mocked<UserService>;
    let jwtService: jest.Mocked<JwtService>;
    let configService: jest.Mocked<ConfigService>;
    let passwordService: jest.Mocked<PasswordService>;

    const mockUser = {
        id: "user-id",
        login: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "1234567890",
        role: Role.USER,
        createdAt: new Date(),
        tickets: []
    };

    beforeEach(async () => {
        const mockUserService = {
            findByLogin: jest.fn(),
            checkExisted: jest.fn(),
            create: jest.fn()
        };

        const mockJwtService = {
            signAsync: jest.fn()
        };

        const mockConfigService = {
            get: jest.fn()
        };

        const mockPasswordService = {
            encrypt: jest.fn(),
            isEqual: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: mockUserService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                },
                {
                    provide: PasswordService,
                    useValue: mockPasswordService
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get(UserService);
        jwtService = module.get(JwtService);
        configService = module.get(ConfigService);
        passwordService = module.get(PasswordService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("validate", () => {
        const signInDto: SignInDto = {
            login: "testuser",
            password: "password123"
        };

        it("should return access token when credentials are correct", async () => {
            userService.findByLogin.mockResolvedValue(mockUser);
            passwordService.isEqual.mockResolvedValue(true);
            configService.get.mockReturnValue({ secret: "jwt-secret" });
            jwtService.signAsync.mockResolvedValue("access-token");

            const result = await service.validate(signInDto);

            expect(result).toEqual({ accessToken: "access-token" });
            expect(userService.findByLogin).toHaveBeenCalledWith(signInDto.login);
            expect(passwordService.isEqual).toHaveBeenCalledWith(signInDto.password, mockUser.password);
            expect(configService.get).toHaveBeenCalledWith("jwt");
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { id: mockUser.id, role: mockUser.role },
                { secret: "jwt-secret" }
            );
        });

        it("should throw NotAcceptableException when password is wrong", async () => {
            userService.findByLogin.mockResolvedValue(mockUser);
            passwordService.isEqual.mockResolvedValue(false);

            await expect(service.validate(signInDto)).rejects.toThrow(NotAcceptableException);
            await expect(service.validate(signInDto)).rejects.toThrow("Password is wrong");
        });

        it("should throw error when user is not found", async () => {
            userService.findByLogin.mockRejectedValue(new Error("User not found"));

            await expect(service.validate(signInDto)).rejects.toThrow("User not found");
        });
    });

    describe("register", () => {
        const signUpDto: SignUpDto = {
            email: "newuser@example.com",
            password: "password123",
            login: "newuser",
            firstName: "New",
            lastName: "User",
            phoneNumber: "0987654321",
            role: Role.USER
        };

        it("should register user successfully", async () => {
            userService.checkExisted.mockResolvedValue(undefined);
            passwordService.encrypt.mockResolvedValue("hashed-password");
            userService.create.mockResolvedValue(undefined);

            await service.register(signUpDto);

            expect(userService.checkExisted).toHaveBeenCalledWith(signUpDto.login, signUpDto.email);
            expect(passwordService.encrypt).toHaveBeenCalledWith(signUpDto.password);
            expect(userService.create).toHaveBeenCalledWith({
                ...signUpDto,
                password: "hashed-password"
            });
        });

        it("should throw ConflictException when user already exists", async () => {
            userService.checkExisted.mockRejectedValue(new ConflictException("This login exists"));

            await expect(service.register(signUpDto)).rejects.toThrow(ConflictException);
            await expect(service.register(signUpDto)).rejects.toThrow("This login exists");
        });

        it("should throw ConflictException when email already exists", async () => {
            userService.checkExisted.mockRejectedValue(new ConflictException("This email exists"));

            await expect(service.register(signUpDto)).rejects.toThrow(ConflictException);
            await expect(service.register(signUpDto)).rejects.toThrow("This email exists");
        });
    });
});
