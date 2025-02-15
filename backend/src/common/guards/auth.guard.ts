import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('IS_PUBLIC', [context.getClass(), context.getHandler()]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];
    if (!bearer || bearer !== 'Bearer') {
      throw new UnauthorizedException('Token is missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      const excludePath = ['/changePassword', '/logout'].some((path) => (request.url as string).includes(path));

      request['user'] = payload;
      return true;
    } catch (error) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token is not active yet');
      } else if (error.status === 405) {
        throw new MethodNotAllowedException('Password Change Requierd');
      } else {
        throw new UnauthorizedException('Failed to authenticate token');
      }
    }
    return true;
  }
}
