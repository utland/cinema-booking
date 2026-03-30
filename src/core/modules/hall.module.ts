import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HallService } from 'src/application/hall/hall.service';
import { HallAccessService } from 'src/domain/common/domain-services/hall-access.service';
import { TypeOrmHallRepository } from 'src/infrastructure/persistence/hall/adapters/typeorm-hall.repository';
import { TypeOrmHall } from 'src/infrastructure/persistence/hall/entities/typeorm-hall.entity';
import { TypeOrmSeat } from 'src/infrastructure/persistence/hall/entities/typeorm-seat.entity';
import { HallController } from 'src/presentation/hall/hall.controller';
import { SessionModule } from './session.module';
import { HALL_REPOSITORY_TOKEN } from 'src/domain/hall/ports/hall.repository';
import { TypeOrmHallMapper } from 'src/infrastructure/persistence/hall/mappers/typeorm-hall.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmHall, TypeOrmSeat]),
    forwardRef(() => SessionModule)
  ],
  controllers: [HallController],
  providers: [
    HallService, 
    HallAccessService,
    TypeOrmHallMapper, 
    { provide: HALL_REPOSITORY_TOKEN, useClass: TypeOrmHallRepository}
  ],
  exports: [HALL_REPOSITORY_TOKEN],
})
export class HallModule {}
