import { IsEnum, IsNumber } from 'class-validator';
import { Role } from 'src/auth/enum/role.enum';

export default class UpdateUserRoleDto {
  @IsEnum(Role)
  role: string;
}
