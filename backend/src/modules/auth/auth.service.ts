import {
  BadRequestException,
  ConflictException,
  Get,
  Inject,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ProtectedRoute } from '../../common/decorator/protect-route.decorator';
import { ApiResponse } from 'src/common/helpers/apiResponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async sigin({ password, phone }: LoginDto) {
    const checkUser = await this.prismaService.user.findUnique({ where: { phone } });
    if (checkUser) throw new NotFoundException('bunaqa raqamli faydolanuvchi bor');

    const hashPassword = await bcrypt.hash(password, 10);
    await this.prismaService.user.create({ data: { password: hashPassword, phone, status: 'INACTIVE' } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheService.set(`otp-${phone}`, otp, 300000);

    console.log(otp);

    return new ApiResponse('faydolanuvchi otp tastiklang');
  }

  async verifyOTP({ phone, otp }: { phone: string; otp: string }) {
    const user = await this.prismaService.user.findFirst({ where: { phone, status: 'INACTIVE' } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi yokiy tastiklangan');

    const checkOtp = await this.cacheService.get<string>(`otp-${phone}`);
    if (!checkOtp) throw new ConflictException('OTP muddati tugadi');

    if (otp !== checkOtp) throw new BadRequestException("Noto'g'ri OTP");

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { status: 'ACTIVE' },
    });

    await this.cacheService.del(`otp-${phone}`);

    return new ApiResponse('Foydalanuvchi muvaffaqiyatli tasdiqlandi');
  }

  @ProtectedRoute({
    isPublic: true,
  })
  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phone: loginDto.phone,
        status: { not: 'INACTIVE' },
      },
    });

    if (!user) {
      throw new NotFoundException('Foydalanauvchi topilmadi');
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRED'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
    });
    await this.cacheService.set(`user-${user.id}`, refreshToken);

    return { accessToken, refreshToken };
  }

  @ProtectedRoute({
    isPublic: false,
  })
  @Get('verify')
  async verify(@Req() req: Request) {
    const { id, role } = req['user'];
    return {
      id,
      role,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const verifyToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: verifyToken.id },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const cachedToken = await this.cacheService.get<string>(`user-${user.id}`);
      if (cachedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { id: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRED'),
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
      });

      await this.cacheService.set(`user-${user.id}`, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      } else {
        throw new UnauthorizedException('Failed to authenticate refresh token');
      }
    }
  }

  async logout(userId: string) {
    try {
      await this.cacheService.del(`user-${userId}`);
      return { message: 'User is logged out' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      } else {
        throw new UnauthorizedException('Failed to authenticate access token');
      }
    }
  }
}
