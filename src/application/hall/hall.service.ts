import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";
import { CreateHallDto } from "./dtos/request/create-hall.dto";
import { Hall } from "src/domain/hall/models/hall.entity";
import { HallEditorDto } from "./dtos/response/hall-editor.dto";
import { UpdateHallInfoDto } from "./dtos/request/update-hall-info.dto";
import { HallListItemDto } from "./dtos/response/hall-list-item.dto";
import { HallAccessService } from "src/domain/common/domain-services/hall-access.service";
import { UpdateSeatsDto } from "./dtos/request/update-seats.dto";
import { toHallEditorDto } from "./dtos/mappers/to-hall-editor";
import { toHallListDto } from "./dtos/mappers/to-hall-list";

@Injectable()
export class HallService {
  constructor(
    @Inject(HALL_REPOSITORY_TOKEN)
    private readonly hallRepo: HallRepository,
    
    private readonly hallAccessService: HallAccessService
  ) {}
  
  public async create({ name, type, seats }: CreateHallDto): Promise<void> {
    const hall = new Hall(name, type, seats);
    await this.hallRepo.save(hall);
  }

  public async findAll(): Promise<HallListItemDto[]> {
    const halls = await this.hallRepo.findAll();

    const dto = toHallListDto(halls);

    return dto;
  }

  public async findById(hallId: string): Promise<HallEditorDto> {
    const hall = await this.hallRepo.findById(hallId);
    if (!hall) throw new NotFoundException("This hall is not found");

    const dto = toHallEditorDto(hall);

    return dto;
  }

  public async updateInfo({ hallId, name, type }: UpdateHallInfoDto): Promise<void> {
    const hall = await this.hallRepo.findById(hallId);
    if (!hall) throw new NotFoundException("This hall is not found");

    hall.changeInfo(name, type);

    await this.hallRepo.save(hall);
  }

  public async updateSeats({ hallId, seats }: UpdateSeatsDto): Promise<void> {
    this.hallAccessService.checkOngoingSessions(hallId);

    const hall = await this.hallRepo.findById(hallId);
    if (!hall) throw new NotFoundException("This hall doesn't exist"); 

    hall.setSeats(seats);

    await this.hallRepo.save(hall);
  }

  public async delete(hallId: string): Promise<void> {
    this.hallAccessService.checkOngoingSessions(hallId);
        
    const hall = await this.hallRepo.findById(hallId);
    if (!hall) throw new NotFoundException("This hall doesn't exist");

    await this.hallRepo.delete(hall);
  }

}
