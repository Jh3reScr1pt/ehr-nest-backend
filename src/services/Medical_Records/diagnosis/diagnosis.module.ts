import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiagnosisController],
  providers: [DiagnosisService, PrismaService],
})
export class DiagnosisModule {}
