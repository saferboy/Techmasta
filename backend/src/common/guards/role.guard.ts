import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma';
import { ROLES, ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>('IS_PUBLIC', [context.getClass(), context.getHandler()]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const requestUser = request.user;
    if (!requestUser) {
      throw new UnauthorizedException('Token is missing');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: requestUser.id,
      },
    });
    if (!requiredRoles) return true;
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return true;
  }
}
