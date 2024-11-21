import { Module } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiseasesController],
  providers: [DiseasesService, PrismaService],
})
export class DiseasesModule {}
