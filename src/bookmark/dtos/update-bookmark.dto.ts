import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateBookmarkDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  desc: string;

  @IsUrl()
  @IsOptional()
  link: string;
}
