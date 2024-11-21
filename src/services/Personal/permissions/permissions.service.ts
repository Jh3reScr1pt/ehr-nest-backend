import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}
  async create(createPermissionDto: CreatePermissionDto) {
    // Verifica que el campo role_name no esté vacío
    if (
      !createPermissionDto.permission_name ||
      createPermissionDto.permission_name.trim() === ''
    ) {
      throw new BadRequestException('role_name cannot be empty');
    }
    try {
      await this.prismaService.permissions.create({
        data: createPermissionDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Permission created successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(
          `Permission with name -> ${createPermissionDto.permission_name} already exists`,
        );
      }
    }
  }
  findAll() {
    return this.prismaService.permissions.findMany();
  }
  async findOne(id: number) {
    const permissionFound = await this.prismaService.permissions.findUnique({
      where: { id: id },
    });
    if (!permissionFound) {
      throw new NotFoundException(`Permission with id -> ${id}, not found`);
    }
    return permissionFound;
  }
  async activePermissions() {
    const activePermissions = await this.prismaService.permissions.findMany({
      where: { isActive: true },
    });

    if (activePermissions.length === 0) {
      throw new NotFoundException('No active permissions found');
    }

    return activePermissions;
  }
  async inactivePermissions() {
    const inactivePermissions = await this.prismaService.permissions.findMany({
      where: { isActive: false },
    });

    if (inactivePermissions.length === 0) {
      throw new NotFoundException('No inactive permissions found');
    }

    return inactivePermissions;
  }
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      await this.prismaService.permissions.update({
        where: { id },
        data: updatePermissionDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Permission updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Permission with id -> ${id}, not found`);
      }
      throw error;
    }
  }
  async updateIsActive(id: number) {
    const permissionFound = await this.prismaService.permissions.findUnique({
      where: { id },
    });

    if (!permissionFound) {
      throw new NotFoundException(`Permission  with id "${id}" not found`);
    }

    const newState = !permissionFound.isActive;

    await this.prismaService.permissions.update({
      where: { id },
      data: { isActive: newState },
    });

    const message = newState
      ? `Permission has been activated successfully`
      : `Permission has been deactivated successfully`;

    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }
  async remove(id: number) {
    const permissionFound = await this.prismaService.permissions.findUnique({
      where: { id },
    });

    if (!permissionFound) {
      throw new NotFoundException(`Permission with id "${id}" not found`);
    }

    if (permissionFound.isActive) {
      throw new ConflictException('Permission cannot be deleted while active');
    }

    await this.prismaService.permissions.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Permission with id "${id}" deleted successfully`,
    };
  }
}
