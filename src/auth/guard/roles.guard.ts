import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // in case of no roles, so it will allow all access
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();

    console.log(req.user);

    if (requiredRoles.includes(req.user.role)) return true;

    return false;
  }
}
