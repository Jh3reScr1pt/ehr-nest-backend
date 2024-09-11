import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { PersonalModule } from './personal/personal.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [RolesModule, SpecialtiesModule, PersonalModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
