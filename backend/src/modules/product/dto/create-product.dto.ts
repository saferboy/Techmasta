import { ProductType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  @MinLength(3)
  slug: string; // unique

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsString()
  poster: string;

  @IsEnum(ProductType)
  @IsOptional()
  productType?: ProductType;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  @IsOptional()
  discountRuleId?: number;
}
