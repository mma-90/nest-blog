import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enum/role.enum';

export default class UpdateUserRoleDto {
  @IsEnum(Role)
  role: string;
}
