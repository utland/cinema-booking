import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { HallModule } from 'src/hall/hall.module';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), HallModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
