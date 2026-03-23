import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Hall } from './entities/hall.entity';
import { DataSource, In, type QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { TicketStatus } from 'src/ticket/entities/ticket.entity';
import { UpdateSeatDto, UpdateSeatsDto } from './dto/update-seat.dto';
import { isBefore } from 'date-fns';
import { DeleteSeatsDto } from './dto/delete-seats.dto';

@Injectable()
export class HallService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallRepo: Repository<Hall>,

    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,

    private readonly dataSource: DataSource
  ) {}
  
  public async create(createHallDto: CreateHallDto): Promise<Hall> {
    const { name, type, seats} = createHallDto;

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hall = await queryRunner.manager.save(Hall, { name, type });

      const seatsOrm = seats.map(seat => ({ ...seat, hallId: hall.id }));
      await manager.save(Seat, seatsOrm);

      await queryRunner.commitTransaction();

      return hall;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error
    } finally {
      await queryRunner.release();
    }
  }

  public async findAll(): Promise<Hall[]> {
    return await this.hallRepo.find();
  }

  public async findById(hallId: string): Promise<Hall> {
    const hall = await this.hallRepo.findOne({ 
      where: { id: hallId },  
      relations: ["seats"] 
    });
    
    if (!hall) throw new NotFoundException("This hall is not found");

    return hall;
  }

  public async findForSession(hallId: string, sessionId: string): Promise<Hall> {
    const hall = await this.hallRepo
      .createQueryBuilder("hall")
      .leftJoinAndSelect("hall.seats", "seat")
      .leftJoinAndSelect(
        "seat.tickets",
        "ticket",
        "ticket.sessionId = :sessionId AND ticket.status != :status",
        { sessionId, status: TicketStatus.CANCELLED}
      )
      .where("hall.id = :hallId", { hallId })
      .getOne();
    
    if (!hall) throw new NotFoundException("This hall is not found");

    return hall
  }

  public async updateInfo(id: string, updateHallDto: UpdateHallDto): Promise<void> {
    await this.hallRepo.update(id, updateHallDto);
  }

  public async updateSeats(updatesSeatsDto: UpdateSeatsDto): Promise<void> {
    const { hallId, seats } = updatesSeatsDto;

    await this.checkSessions(hallId);

    await Promise.all(seats.map(seat => {
      return this.seatRepo.update({ id: seat.id, hallId }, { IsAvailable: seat.isAvailable });
    }));
  }

  public async deleteSeats(deleteSeatsDto: DeleteSeatsDto): Promise<void> {
    const { hallId, seatsId } = deleteSeatsDto;

    await this.checkSessions(hallId);

    await this.seatRepo.delete({ id: In(seatsId) });
  }

  public async remove(id: string): Promise<void> {
    await this.hallRepo.delete({ id })
  }

  public async checkSessions(hallId: string): Promise<void> {
    const hall = await this.hallRepo.findOne({ where: { id: hallId }, relations: ["sessions"] });
    if (!hall) throw new NotFoundException('Hall is not found');

    const isSessionEnded = hall.sessions.every(item => isBefore(item.finishTime, new Date()));
    if (!isSessionEnded) {
      throw new ConflictException('You cannot update seats because there are active sessions in this hall');
    }
  }

}
