import { IsString } from 'class-validator';

export class verifyOTP {
  @IsString()
  phone: string;

  @IsString()
  otp: string;
}

export class resendVerifyOtp {
  @IsString()
  phone: string;
}
