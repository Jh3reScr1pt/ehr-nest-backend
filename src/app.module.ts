import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { PersonalModule } from './personal/personal.module';
import { PrismaService } from './prisma/prisma.service';
import { DoctorSpecialtiesModule } from './doctor_specialties/doctor_specialties.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    RolesModule,
    SpecialtiesModule,
    PersonalModule,
    DoctorSpecialtiesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
