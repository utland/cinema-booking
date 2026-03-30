import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/domain/user/ports/user.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmUser } from "../entities/typeorm-user.entity";
import { User } from "src/domain/user/models/user.entity";
import { TypeOrmUserMapper } from "../mapper/typeorm-user.mapper";

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(TypeOrmUser)
        private readonly userRepo: Repository<TypeOrmUser>,

        private readonly userMapper: TypeOrmUserMapper
    ) {}

    public async findById(id: string): Promise<User | null> {
        const userOrm = await this.userRepo.findOne({ where: { id } });
        if (!userOrm) return null;

        return this.userMapper.toDomain(userOrm);
    }

    public async findByLogin(login: string): Promise<User | null> {
        const userOrm = await this.userRepo.findOne({ where: { login } });
        if (!userOrm) return null;

        return this.userMapper.toDomain(userOrm);
    }

    public async findByEmail(email: string): Promise<User | null> {
        const userOrm = await this.userRepo.findOne({ where: { email } });
        if (!userOrm) return null;

        return this.userMapper.toDomain(userOrm);
    }

    public async save(user: User): Promise<void> {
        const userOrm = this.userMapper.toOrm(user);

        await this.userRepo.save(userOrm);
    }

    public async delete(user: User): Promise<void> {
        const userOrm = this.userMapper.toOrm(user);
        
        await this.userRepo.remove(userOrm);
    }
}