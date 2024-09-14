import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      await this.prismaService.roles.create({ data: createRoleDto });
      return { message: 'Role  created successfully' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(
          `Role with name -> ${createRoleDto.role_name} already exists`,
        );
      }
    }
  }

  findAll() {
    return this.prismaService.roles.findMany();
  }

  async findOne(id: number) {
    const roleFound = await this.prismaService.roles.findUnique({
      where: { id: id },
    });
    if (!roleFound) {
      throw new NotFoundException(`Role with id -> ${id}, not found`);
    }
    return roleFound;
  }

  async activeRoles() {
    const activeRoles = await this.prismaService.roles.findMany({
      where: { isActive: true },
    });

    if (activeRoles.length === 0) {
      throw new NotFoundException('No active roles found');
    }

    return activeRoles;
  }

  async inactiveRoles() {
    const inactiveRoles = await this.prismaService.roles.findMany({
      where: { isActive: false },
    });

    if (inactiveRoles.length === 0) {
      throw new NotFoundException('No inactive roles found');
    }

    return inactiveRoles;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      await this.prismaService.roles.update({
        where: { id },
        data: updateRoleDto,
      });
      return { message: 'Role updated successfully' };
    } catch (error) {
      // Verifica el tipo de error lanzado por Prisma
      if (error.code === 'P2025') {
        // Código de error específico para "Record to update not found"
        throw new NotFoundException(`Role with id -> ${id}, not found`);
      }
      // Lanza otros errores no esperados
      throw error;
    }
  }

  async updateIsActive(id: number) {
    const roleFound = await this.prismaService.roles.findUnique({
      where: { id },
    });

    if (!roleFound) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    // Cambia el estado a su valor opuesto
    const newState = !roleFound.isActive;

    // Actualiza el rol con el nuevo estado
    await this.prismaService.roles.update({
      where: { id },
      data: { isActive: newState },
    });

    // Devuelve un mensaje según el nuevo estado
    const message = newState
      ? `Role has been activated successfully`
      : `Role has been deactivated successfully`;

    return { message };
  }

  async remove(id: number) {
    const roleFound = await this.prismaService.roles.findUnique({
      where: { id },
    });

    if (!roleFound) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    if (roleFound.isActive) {
      throw new ConflictException('Role cannot be deleted while active');
    }

    await this.prismaService.roles.delete({
      where: { id },
    });

    return { message: `Role with id "${id}" deleted successfully` };
  }
}
