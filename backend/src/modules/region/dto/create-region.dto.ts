import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @MaxLength(100)
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(4)
  code: string;
}
