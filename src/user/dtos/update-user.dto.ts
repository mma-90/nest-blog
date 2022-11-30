import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
