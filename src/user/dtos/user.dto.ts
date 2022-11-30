import { Exclude, Expose } from 'class-transformer';

export default class UserDto {
  //   @Expose()
  //   id: number;

  //   @Expose()
  //   email: string;

  @Exclude()
  hash: string;
}
