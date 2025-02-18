import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PrismaService } from 'src/common/prisma';
import { ApiResponse } from 'src/common/helpers/apiResponse';
import { IQuery } from 'src/common/types';
import { Pagination } from 'src/common/helpers/pagination';

@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const newDistrict = createDistrictDto;

    const district = await this.prisma.district.findUnique({ where: { code: createDistrictDto.code } });
    if (district) throw new ConflictException('district exists');

    const region = await this.prisma.region.findUnique({ where: { id: createDistrictDto.regionId } });
    if (!region) throw new NotFoundException('region not found');

    await this.prisma.district.create({ data: newDistrict });

    return new ApiResponse('created district', 201);
  }

  async findAll({ page, limit }: IQuery) {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const districts = await this.prisma.district.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where: { isDeleted: false },
    });

    const count = await this.prisma.district.count({ where: { isDeleted: false } });
    const pagination = new Pagination(count, pageNumber, pageSize);

    return new ApiResponse(districts, 200, pagination);
  }

  async findOne(id: number) {
    const district = await this.prisma.district.findFirst({ where: { id, isDeleted: false } });
    if (!district) throw new NotFoundException('district not found');

    return new ApiResponse(district);
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const newDistrict = updateDistrictDto;

    if (updateDistrictDto.code) {
      const district = await this.prisma.district.findUnique({ where: { code: updateDistrictDto.code } });
      if (district) throw new ConflictException('district exists');
    }

    if (updateDistrictDto.regionId) {
      const region = await this.prisma.region.findUnique({ where: { id: updateDistrictDto.regionId } });
      if (!region) throw new NotFoundException('region not found');
    }

    await this.prisma.district.update({ where: { id }, data: newDistrict });

    return new ApiResponse('updated district');
  }

  async remove(id: number) {
    const district = await this.prisma.district.findFirst({ where: { id } });
    if (!district) throw new NotFoundException('district not found');

    await this.prisma.district.update({ where: { id }, data: { isDeleted: true } });
    return new ApiResponse('deleted district');
  }
}
