import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  phone: string;

  @Length(3, 100)
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
}
