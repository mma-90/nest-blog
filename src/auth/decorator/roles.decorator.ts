import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';

export const AuthorizedRoles = (...authRoles: Role[]) => {
  return SetMetadata('roles', authRoles);
};

// @Roles('admin', 'editor') this decorator allows specifying what roles are required to access specific resources.
// apply role on routes on controller files
