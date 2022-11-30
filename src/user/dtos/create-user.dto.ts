import { IsEmail, MinLength, IsString, IsNotEmpty } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
