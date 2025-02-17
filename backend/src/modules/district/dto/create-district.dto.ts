import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @MaxLength(100)
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(4)
  code: string;

  @IsNumber()
  regionId: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
