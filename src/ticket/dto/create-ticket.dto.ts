import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  seatId: string;
}
