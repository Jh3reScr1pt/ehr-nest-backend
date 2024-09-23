import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PersonalService {
  constructor(private prismaService: PrismaService) {}
  async create(createPersonalDto: CreatePersonalDto) {
    // Verificar si el roleId existe
    const roleExists = await this.prismaService.roles.findUnique({
      where: { id: createPersonalDto.roleId },
    });

    // Si no existe, lanzar NotFoundException
    if (!roleExists) {
      throw new NotFoundException(
        `Role with id -> ${createPersonalDto.roleId} not found`,
      );
    }

    try {
      // Cifrar la contraseña antes de guardar el usuario
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        createPersonalDto.password,
        salt,
      );
      // Reemplaza la contraseña en el DTO con la versión cifrada
      createPersonalDto.password = hashedPassword;
      await this.prismaService.personal.create({ data: createPersonalDto });
      return { message: 'Personal created successfully' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(
          `Personal with email -> ${createPersonalDto.email} already exists`,
        );
      }
      // Lanza otros errores no esperados
      throw error;
    }
  }

  findAll() {
    return this.prismaService.personal.findMany();
  }

  async findOne(id: number) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id: id },
    });
    if (!personalFound) {
      throw new NotFoundException(`Personal with id -> ${id}, not found`);
    }
    return personalFound;
  }
  async findByEmail(email: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: { email },
    });

    if (!personal) {
      throw new NotFoundException(`Personal with email -> ${email}, not found`);
    }

    return personal;
  }

  async activePersonal() {
    const activePersonal = await this.prismaService.personal.findMany({
      where: { isActive: true },
    });

    if (activePersonal.length === 0) {
      throw new NotFoundException('No active personal found');
    }

    return activePersonal;
  }

  async inactivePersonal() {
    const inactivePersonal = await this.prismaService.personal.findMany({
      where: { isActive: false },
    });

    if (inactivePersonal.length === 0) {
      throw new NotFoundException('No inactive personal found');
    }

    return inactivePersonal;
  }

  async update(id: number, updatePersonalDto: UpdatePersonalDto) {
    try {
      await this.prismaService.personal.update({
        where: { id },
        data: updatePersonalDto,
      });
      return { message: 'Personal updated successfully' };
    } catch (error) {
      // Verifica el tipo de error lanzado por Prisma
      if (error.code === 'P2025') {
        // Código de error específico para "Record to update not found"
        throw new NotFoundException(`Personal with id -> ${id}, not found`);
      }
      // Lanza otros errores no esperados
      throw error;
    }
  }

  async updateIsActive(id: number) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id },
    });

    if (!personalFound) {
      throw new NotFoundException(`Personal with id "${id}" not found`);
    }

    // Cambia el estado a su valor opuesto
    const newState = !personalFound.isActive;

    // Actualiza el rol con el nuevo estado
    await this.prismaService.personal.update({
      where: { id },
      data: { isActive: newState },
    });

    // Devuelve un mensaje según el nuevo estado
    const message = newState
      ? `Personal has been activated successfully`
      : `Personal has been deactivated successfully`;

    return { message };
  }

  async remove(id: number) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id },
    });

    if (!personalFound) {
      throw new NotFoundException(`Personal with id "${id}" not found`);
    }

    if (personalFound.isActive) {
      throw new ConflictException('Personal cannot be deleted while active');
    }

    await this.prismaService.personal.delete({
      where: { id },
    });

    return { message: `Personal with id "${id}" deleted successfully` };
  }
  async getLoginInfo(email: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: { email },
    });

    if (!personal) {
      throw new NotFoundException(`Personal with email -> ${email}, not found`);
    }

    // Retorna el email y la contraseña almacenada (hasheada)
    return {
      email: personal.email,
      password: personal.password, // La contraseña en formato hash
    };
  }
}
