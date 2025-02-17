import { Module } from '@nestjs/common';
import { RegionModule } from './modules/region/region.module';
import { PrismaModule, PrismaService } from './common/prisma';
import { DistrictModule } from './modules/district/district.module';

@Module({
  imports: [PrismaModule, RegionModule, DistrictModule],
})
export class AppModule {}
