import { ConflictException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { PASSWORD_SERVICE_TOKEN, type PasswordService } from '../common/ports/password.service';
import { ValidateUserDto } from './dtos/request/validate-user.dto';
import { ValidateResponseDto } from './dtos/response/validate-response.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from '../common/ports/credential.service';
import { USER_REPOSITORY_TOKEN, type UserRepository } from 'src/domain/user/ports/user.repository';
import { Role, User } from 'src/domain/user/models/user.entity';
import { Payload } from '../common/models/payload.i';
import { UserByTokenDto } from './dtos/response/user-by-token.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: UserRepository,

    @Inject(PASSWORD_SERVICE_TOKEN)
    private readonly passwordService: PasswordService,

    @Inject(CREDENTIAL_SERVICE_TOKEN)
    private readonly credentialService: CredentialService
  ) {}

  public async create(
    { email, password, login, firstName, lastName}: CreateUserDto
  ): Promise<void> {
    const hashed = await this.passwordService.hash(password);

    const existedUserByLogin = await this.userRepo.findByLogin(login);
    if (existedUserByLogin) throw new ConflictException("This login is occupied");

    const existedUserByEmail = await this.userRepo.findByEmail(email);
    if (existedUserByEmail) throw new ConflictException("This email is occupied");

    const user = new User(login, email, hashed, firstName, lastName, Role.USER);
    await this.userRepo.save(user);
  }

  public async validate({ login, password }: ValidateUserDto): Promise<ValidateResponseDto> {
    const user = await this.userRepo.findByLogin(login);
    if (!user) throw new ConflictException("User is not found");

    const isPasswordEqual = await this.passwordService.compare(password, user.hashedPassword);
    if (!isPasswordEqual) throw new NotAcceptableException('Password is wrong');

    const payload: Payload = { id: user.id, role: user.role };

    const secret = process.env.JWT_SECRET;
    const accessToken = await this.credentialService.generate(payload, secret);

    return { accessToken };
  }

  public async findById(userId: string): Promise<UserByTokenDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return { 
      id: user.id, 
      login: user.login, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName 
    };
  }

  public async update({ firstName, lastName, userId }: UpdateUserDto): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.updateInfo(firstName, lastName);

    await this.userRepo.save(user);
  }

  public async remove(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.delete(user);
  }
}
