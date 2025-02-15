import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ProtectedRoute } from '../../common/decorator/protect-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ProtectedRoute({
    isPublic: true,
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken });
  }

  @ProtectedRoute({
    isPublic: true,
  })
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh = req.cookies['refreshToken'];
    const { refreshToken, accessToken } = await this.authService.refresh(refresh);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken });
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

  @ProtectedRoute({})
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { id } = req['user'];
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });

    const response = await this.authService.logout(id);
    res.send(response);
  }
}
