import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsInt()
  @IsNotEmpty()
  recipient_id: number;
}