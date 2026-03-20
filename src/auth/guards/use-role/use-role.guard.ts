import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UseRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, //! esto ayuda a optener la metadata
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] =
      this.reflector.get(META_ROLES, context.getHandler()) || [];

    if (!validRoles || validRoles.length == 0) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `User ${user.fullName} need a valid role: [${validRoles}]`,
    );
  }
}
