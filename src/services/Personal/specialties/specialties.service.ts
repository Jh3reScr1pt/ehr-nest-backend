import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SpecialtiesService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    if (
      !createSpecialtyDto.specialty_name ||
      createSpecialtyDto.specialty_name.trim() === ''
    ) {
      throw new BadRequestException('specialty_name cannot be empty');
    }
    try {
      await this.prismaService.specialties.create({ data: createSpecialtyDto });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Specialty  created successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(
          `Specialty with name -> ${createSpecialtyDto.specialty_name} already exists`,
        );
      }
    }
  }

  findAll() {
    return this.prismaService.specialties.findMany();
  }

  async findOne(id: number) {
    const specialtyFound = await this.prismaService.specialties.findUnique({
      where: { id: id },
    });
    if (!specialtyFound) {
      throw new NotFoundException(`Specialty with id -> ${id}, not found`);
    }
    return specialtyFound;
  }

  async activeSpecialties() {
    const activeSpecialties = await this.prismaService.specialties.findMany({
      where: { isActive: true },
    });

    if (activeSpecialties.length === 0) {
      throw new NotFoundException('No active specialties found');
    }

    return activeSpecialties;
  }

  async inactiveSpecialties() {
    const inactiveSpecialties = await this.prismaService.specialties.findMany({
      where: { isActive: false },
    });

    if (inactiveSpecialties.length === 0) {
      throw new NotFoundException('No inactive specialties found');
    }

    return inactiveSpecialties;
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    try {
      await this.prismaService.specialties.update({
        where: { id },
        data: updateSpecialtyDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Specialty updated successfully',
      };
    } catch (error) {
      // Verifica el tipo de error lanzado por Prisma
      if (error.code === 'P2025') {
        // Código de error específico para "Record to update not found"
        throw new NotFoundException(`Specialty with id -> ${id}, not found`);
      }
      // Lanza otros errores no esperados
      throw error;
    }
  }

  async updateIsActive(id: number) {
    const specialtyFound = await this.prismaService.specialties.findUnique({
      where: { id },
    });

    if (!specialtyFound) {
      throw new NotFoundException(`Specialty with id "${id}" not found`);
    }

    // Cambia el estado a su valor opuesto
    const newState = !specialtyFound.isActive;

    // Actualiza la especialidad con el nuevo estado
    await this.prismaService.specialties.update({
      where: { id },
      data: { isActive: newState },
    });

    // Devuelve un mensaje según el nuevo estado
    const message = newState
      ? `Specialty has been activated successfully`
      : `Specialty has been deactivated successfully`;

    return { statusCode: HttpStatus.OK, message };
  }

  async remove(id: number) {
    const specialtyFound = await this.prismaService.specialties.findUnique({
      where: { id },
    });

    if (!specialtyFound) {
      throw new NotFoundException(`Specialty with id "${id}" not found`);
    }

    if (specialtyFound.isActive) {
      throw new ConflictException('Specialty cannot be deleted while active');
    }

    await this.prismaService.specialties.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Specialty with id "${id}" deleted successfully`,
    };
  }
}
