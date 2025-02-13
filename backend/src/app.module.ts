import { Module } from '@nestjs/common';
import { RegionModule } from './modules/region/region.module';
import { PrismaModule, PrismaService } from './common/prisma';

@Module({
  imports: [PrismaModule, RegionModule],
})
export class AppModule {}
