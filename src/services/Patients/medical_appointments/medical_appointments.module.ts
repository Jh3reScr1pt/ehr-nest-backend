import { Module } from '@nestjs/common';
import { MedicalAppointmentsService } from './medical_appointments.service';
import { MedicalAppointmentsController } from './medical_appointments.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MedicalAppointmentsController],
  providers: [MedicalAppointmentsService, PrismaService],
})
export class MedicalAppointmentsModule {}
