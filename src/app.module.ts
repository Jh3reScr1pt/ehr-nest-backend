import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesModule } from './services/Personal/roles/roles.module';
import { SpecialtiesModule } from './services/Personal/specialties/specialties.module';
import { PersonalModule } from './services/Personal/personal/personal.module';
import { PrismaService } from './prisma/prisma.service';
import { DoctorSpecialtiesModule } from './services/Personal/doctor_specialties/doctor_specialties.module';
import { AuthModule } from './auth/auth.module';
import { RolesPermissionsModule } from './services/Personal/roles_permissions/roles_permissions.module';
import { PermissionsModule } from './services/Personal/permissions/permissions.module';
import { PatientsModule } from './services/Patients/patients/patients.module';
import { MedicalAppointmentsModule } from './services/Patients/medical_appointments/medical_appointments.module';
import { SchedulesModule } from './services/Personal/schedules/schedules.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { MedicalRecordsModule } from './services/Medical_Records/medical_records/medical_records.module';
import { DiagnosisModule } from './services/Medical_Records/diagnosis/diagnosis.module';
import { DiseasesGroupModule } from './services/Medical_Records/diseases_group/diseases_group.module';
import { DiseasesModule } from '@services/Medical_Records/diseases/diseases.module';
import { TreatmentsModule } from '@services/Medical_Records/treatments/treatments.module';

@Module({
  imports: [
    RolesModule,
    SpecialtiesModule,
    PersonalModule,
    DoctorSpecialtiesModule,
    AuthModule,
    RolesPermissionsModule,
    PermissionsModule,
    PatientsModule,
    MedicalAppointmentsModule,
    SchedulesModule,
    MedicalRecordsModule,
    DiagnosisModule,
    DiseasesGroupModule,
    DiseasesModule,
    TreatmentsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
//export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('patients', 'roles')
      .apply(AuthMiddleware)
      .forRoutes('patients');
  }
}
