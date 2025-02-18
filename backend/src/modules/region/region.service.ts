import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiResponse } from 'src/common/helpers/apiResponse';
import { PrismaService } from 'src/common/prisma';
import { IQuery } from 'src/common/types';
import { Pagination } from 'src/common/helpers/pagination';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}
  async create(createRegionDto: CreateRegionDto) {
    const region = await this.prisma.region.findUnique({ where: { code: createRegionDto.code } });
    if (region) throw new ConflictException('region exists');

    await this.prisma.region.create({ data: createRegionDto });

    return new ApiResponse('created region');
  }

  async findAll({ page, limit }: IQuery) {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const regions = await this.prisma.region.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where: { isDeleted: false },
    });

    const count = await this.prisma.region.count({ where: { isDeleted: false } });
    const pagination = new Pagination(count, pageNumber, pageSize);

    return new ApiResponse(regions, 200, pagination);
  }

  async findOne(id: number) {
    const region = await this.prisma.region.findFirst({ where: { id, isDeleted: false } });
    if (!region) throw new NotFoundException('region not found');

    return new ApiResponse(region);
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const region = await this.prisma.region.findFirst({ where: { AND: [{ code: updateRegionDto.code }, { id }] } });
    if (!region) throw new ConflictException('region not found or invalid code');

    await this.prisma.region.update({ where: { id }, data: updateRegionDto });

    return new ApiResponse('updated region');
  }

  async remove(id: number) {
    const region = await this.prisma.region.findFirst({ where: { id } });
    if (!region) throw new NotFoundException('region not found');

    await this.prisma.region.update({ where: { id }, data: { isDeleted: true } });
    return new ApiResponse('deleted region');
  }
}
