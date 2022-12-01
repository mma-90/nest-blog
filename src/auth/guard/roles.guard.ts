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

    // req have user thanks to JWTStrategy validate return

    if (requiredRoles.includes(req.user.role)) return true;

    return false;
  }
}

/*
Reflector helping in getting roles that are entered by @HasRoles(...) decorator
*/
