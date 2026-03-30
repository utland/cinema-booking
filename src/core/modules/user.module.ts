import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/application/user/user.service';
import { USER_REPOSITORY_TOKEN } from 'src/domain/user/ports/user.repository';
import { TypeOrmUserRepository } from 'src/infrastructure/persistence/user/adapters/typeorm-user.repository';
import { TypeOrmUser } from 'src/infrastructure/persistence/user/entities/typeorm-user.entity';
import { TypeOrmUserMapper } from 'src/infrastructure/persistence/user/mapper/typeorm-user.mapper';
import { UserController } from 'src/presentation/user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmUser])],
  controllers: [UserController],
  providers: [
    UserService, 
    TypeOrmUserMapper,
    { provide: USER_REPOSITORY_TOKEN, useClass: TypeOrmUserRepository }
  ],
})
export class UserModule {}
