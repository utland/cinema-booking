import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserApiDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
