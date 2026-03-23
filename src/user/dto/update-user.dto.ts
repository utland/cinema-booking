import { OmitType, PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/sign-up.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(SignUpDto, ['password', 'login'] as const),
) {}
