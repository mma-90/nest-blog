import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;
}
