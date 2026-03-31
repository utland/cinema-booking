import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HallAccessService } from 'src/domain/common/domain-services/hall-access.service';
import { TypeOrmHallRepository } from 'src/infrastructure/persistence/hall/adapters/typeorm-hall.repository';
import { TypeOrmHall } from 'src/infrastructure/persistence/hall/entities/typeorm-hall.entity';
import { TypeOrmSeat } from 'src/infrastructure/persistence/hall/entities/typeorm-seat.entity';
import { HallController } from 'src/presentation/hall/hall.controller';
import { SessionModule } from './session.module';
import { HALL_REPOSITORY_TOKEN } from 'src/domain/hall/ports/hall.repository';
import { TypeOrmHallMapper } from 'src/infrastructure/persistence/hall/mappers/typeorm-hall.mapper';
import { CreateHallHandler } from 'src/application/hall/commands/create-hall/create-hall.handler';
import { UpdateHallInfoHandler } from 'src/application/hall/commands/update-hall-info/update-hall-info.handler';
import { DeleteHallHandler } from 'src/application/hall/commands/delete-hall/delete-hall.handler';
import { UpdateSeatsHandler } from 'src/application/hall/commands/update-seats/update-seats.handler';
import { FindAllHallHandler } from 'src/application/hall/queries/find-hall-all/find-hall-all.handler';
import { FindHallByIdHandler } from 'src/application/hall/queries/find-hall-by-id/find-hall-by-id.handler';

const commands = [
  CreateHallHandler, 
  DeleteHallHandler, 
  UpdateHallInfoHandler, 
  UpdateSeatsHandler
];

const queries = [
  FindAllHallHandler, 
  FindHallByIdHandler
];


@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmHall, TypeOrmSeat]),
    forwardRef(() => SessionModule)
  ],
  controllers: [HallController],
  providers: [
    ...commands,
    ...queries,
    HallAccessService,
    TypeOrmHallMapper, 
    { provide: HALL_REPOSITORY_TOKEN, useClass: TypeOrmHallRepository}
  ],
  exports: [HALL_REPOSITORY_TOKEN],
})
export class HallModule {}
