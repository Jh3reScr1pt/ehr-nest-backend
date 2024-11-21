import {
  ConflictException,
  Injectable,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateRolesPermissionsDto } from './dto/create-roles_permission.dto';
import { UpdateRolesPermissionsDto } from './dto/update-roles_permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesPermissionsService {
  constructor(private prismaService: PrismaService) {}
  private async validateRoleAndPermission(
    roleId: number,
    permissionId: number,
  ) {
    const role = await this.prismaService.roles.findUnique({
      where: { id: Number(roleId) },
    });
    const permission = await this.prismaService.permissions.findUnique({
      where: { id: Number(permissionId) },
    });

    if (!role) {
      throw new NotFoundException(`Role with id -> ${roleId}, not found`);
    }
    if (!permission) {
      throw new NotFoundException(
        `Permission with id -> ${permissionId}, not found`,
      );
    }

    if (!role.isActive) {
      throw new ConflictException(`Role with id -> ${roleId} is inactive`);
    }
    if (!permission.isActive) {
      throw new ConflictException(
        `Permission with id -> ${permissionId} is inactive`,
      );
    }
  }

  async create(createDto: CreateRolesPermissionsDto) {
    await this.validateRoleAndPermission(
      createDto.roleId,
      createDto.permissionId,
    );

    try {
      await this.prismaService.rolesPermissions.create({
        data: createDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'RolePermission created successfully',
      };
    } catch {
      throw new ConflictException('RolePermission already exists');
    }
  }

  async findAll() {
    return this.prismaService.rolesPermissions.findMany({
      where: {
        role: { isActive: true },
        permission: { isActive: true },
      },
      include: {
        role: true,
        permission: true,
      },
    });
  }

  async findOne(roleId: number, permissionId: number) {
    await this.validateRoleAndPermission(roleId, permissionId);

    const rolePermission = await this.prismaService.rolesPermissions.findUnique(
      {
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
        include: {
          role: true,
          permission: true,
        },
      },
    );
    if (!rolePermission) {
      throw new NotFoundException('RolePermission not found');
    }
    return rolePermission;
  }

  async update(
    roleId: number,
    permissionId: number,
    updateDto: UpdateRolesPermissionsDto,
  ) {
    await this.validateRoleAndPermission(roleId, permissionId);

    try {
      await this.prismaService.rolesPermissions.update({
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
        data: updateDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'RolePermission updated successfully',
      };
    } catch {
      throw new ConflictException('Failed to update RolePermission');
    }
  }

  async remove(roleId: number, permissionId: number) {
    await this.validateRoleAndPermission(roleId, permissionId);

    await this.prismaService.rolesPermissions.delete({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
    });
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'RolePermission deleted successfully',
    };
  }
}
