import { Module } from '@nestjs/common';
import { RolesPermissionsService } from './roles_permissions.service';
import { RolesPermissionsController } from './roles_permissions.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RolesPermissionsController],
  providers: [RolesPermissionsService, PrismaService],
})
export class RolesPermissionsModule {}
