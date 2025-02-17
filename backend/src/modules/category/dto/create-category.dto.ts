import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string; // unique

  @IsString()
  @MaxLength(100)
  @MinLength(3)
  slug: string; // unique

  @IsString()
  description: string;

  @IsString()
  poster: string;

  @IsNumber()
  order: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}
