import { Module } from '@nestjs/common';
import { DiseasesGroupService } from './diseases_group.service';
import { DiseasesGroupController } from './diseases_group.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiseasesGroupController],
  providers: [DiseasesGroupService, PrismaService],
})
export class DiseasesGroupModule {}
