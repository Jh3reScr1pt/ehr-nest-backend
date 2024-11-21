import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical_records.service';
import { MedicalRecordsController } from './medical_records.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, PrismaService],
})
export class MedicalRecordsModule {}
