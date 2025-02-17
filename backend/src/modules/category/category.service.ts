import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common';
import { ApiResponse } from 'src/common/helpers/apiResponse';
import { IQuery } from 'src/common/types';
import { Pagination } from 'src/common/helpers/pagination';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = createCategoryDto;

    const category = await this.prisma.category.findFirst({
      where: { OR: [{ name: createCategoryDto.name }, { slug: createCategoryDto.slug }] },
    });
    if (category) throw new ConflictException('slug or name is conflicted');

    if (createCategoryDto?.parentId) {
      const parant = await this.prisma.category.findUnique({ where: { id: createCategoryDto.parentId } });
      if (!parant) throw new NotFoundException('category not found');
    }

    await this.prisma.category.create({ data: newCategory });

    return new ApiResponse('craeted category', 201);
  }

  async findAll({ page, limit }: IQuery) {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const categorys = await this.prisma.category.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    const count = await this.prisma.category.count();
    const pagination = new Pagination(count, pageNumber, pageSize);

    return new ApiResponse(categorys, 200, pagination);
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findFirst({ where: { id } });
    if (!category) throw new NotFoundException('category not found');

    return new ApiResponse(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { parentId, ...newCategory }: any = updateCategoryDto;

    const category = await this.prisma.category.findFirst({
      where: { OR: [{ name: updateCategoryDto.name }, { slug: updateCategoryDto.slug }] },
    });
    if (category) throw new ConflictException('slug or name is conflicted');

    const checkCtg = await this.prisma.category.findUnique({ where: { id } });
    if (!checkCtg) throw new NotFoundException('category not found');

    if (parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: updateCategoryDto.parentId } });
      if (!parent) throw new NotFoundException('category not found');
      newCategory.parent = { connect: { id: parent.id } };
    }

    await this.prisma.category.update({ where: { id }, data: newCategory });

    return new ApiResponse('updated category', 201);
  }

  async remove(id: number) {
    const category = await this.prisma.category.findFirst({ where: { id }, include: { products: true } });
    if (!category) throw new NotFoundException('category not found');
    if (category.products.length)
      throw new ConflictException('the category is associated with the product, so it cannot be deleted');

    await this.prisma.category.delete({ where: { id } });
    return new ApiResponse('deleted category');
  }
}
