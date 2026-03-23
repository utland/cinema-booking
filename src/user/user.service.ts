import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async create(signUpDto: SignUpDto): Promise<void> {
    await this.userRepo.save(signUpDto);
  }

  public async findByLogin(login: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ login });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepo.update({ id }, updateUserDto);
  }

  public async remove(id: string): Promise<void> {
    await this.userRepo.delete({ id });
  }

  public async checkExisted(login: string, email: string): Promise<void> {
    const existedUser = await this.userRepo.findOneBy([{ login }, { email }]);
    if (!existedUser) return;

    if (existedUser.login === login)
      throw new ConflictException('This login exists');
    if (existedUser.email === email)
      throw new ConflictException('This email exists');
  }
}
