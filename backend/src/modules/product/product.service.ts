import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from 'src/common/helpers/apiResponse';
import { PrismaService } from 'src/common';
import { IQuery } from 'src/common/types';
import { Pagination } from 'src/common/helpers/pagination';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct: any = createProductDto;

    const checkProduct = await this.prisma.product.findUnique({ where: { slug: createProductDto.slug } });
    if (checkProduct) throw new ConflictException('product with slug exists');

    const category = await this.prisma.category.findUnique({ where: { id: createProductDto.categoryId } });
    if (!category) throw new NotFoundException('category not found');

    if (createProductDto.discountRuleId) {
      const discountRule = await this.prisma.discountRule.findUnique({
        where: { id: createProductDto.discountRuleId },
      });
      if (!discountRule) throw new NotFoundException('discountRule not found');
    }
    await this.prisma.product.create({ data: newProduct });
    return new ApiResponse('created product', 201);
  }

  async findAll({ page, limit }: IQuery) {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const products = await this.prisma.product.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    const count = await this.prisma.product.count();
    const pagination = new Pagination(count, pageNumber, pageSize);

    return new ApiResponse(products, 200, pagination);
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) throw new NotFoundException('product not found');

    return new ApiResponse(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const newProduct: any = updateProductDto;

    if (updateProductDto?.slug) {
      const checkProduct = await this.prisma.product.findUnique({ where: { slug: updateProductDto.slug } });
      if (checkProduct) throw new ConflictException('product with slug exists');
    }

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('product not found');

    if (updateProductDto?.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: updateProductDto.categoryId } });
      if (!category) throw new NotFoundException('category not found');
    }
    if (updateProductDto?.discountRuleId) {
      const discountRule = await this.prisma.discountRule.findUnique({
        where: { id: updateProductDto.discountRuleId },
      });
      if (!discountRule) throw new NotFoundException('discountRule not found');
    }
    await this.prisma.product.update({ where: { id }, data: newProduct });
    return new ApiResponse('updated product', 201);
  }

  async remove(id: number) {
    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) throw new NotFoundException('product not found');

    await this.prisma.product.delete({ where: { id } });
    return new ApiResponse('deleted product');
  }
}
