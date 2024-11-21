import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';

@Injectable()
export class DiseasesService {
  constructor(private prismaService: PrismaService) {}

  private validateDiseaseDto(data: CreateDiseaseDto | UpdateDiseaseDto) {
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException('Disease name cannot be empty');
    }
    if (!data.codeCie || data.codeCie.trim() === '') {
      throw new BadRequestException('Disease codeCie cannot be empty');
    }
  }

  async create(createDiseaseDto: CreateDiseaseDto) {
    this.validateDiseaseDto(createDiseaseDto);

    try {
      const disease = await this.prismaService.disease.create({
        data: {
          name: createDiseaseDto.name.trim(),
          codeCie: createDiseaseDto.codeCie.trim(),
          description: createDiseaseDto.description?.trim() || null,
          diseaseGroupId: createDiseaseDto.diseaseGroupId || null,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Disease created successfully',
        disease,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma error for unique constraint violation
        throw new BadRequestException('Disease name or codeCie must be unique');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the disease',
      );
    }
  }

  async findAll() {
    try {
      const diseases = await this.prismaService.disease.findMany({
        include: {
          diseaseGroup: true, // Incluir detalles del grupo de enfermedades, si aplica
        },
      });

      if (!diseases || diseases.length === 0) {
        throw new NotFoundException('No diseases found');
      }

      return diseases.map((disease) => ({
        id: disease.id,
        name: disease.name,
        codeCie: disease.codeCie,
        description: disease.description,
        diseaseGroup: disease.diseaseGroup
          ? {
              id: disease.diseaseGroup.id,
              name: disease.diseaseGroup.name,
            }
          : null,
        createdAt: disease.createdAt,
        updatedAt: disease.updatedAt,
      }));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching diseases',
      );
    }
  }

  async update(id: number, updateDiseaseDto: UpdateDiseaseDto) {
    const existingDisease = await this.prismaService.disease.findUnique({
      where: { id },
    });

    if (!existingDisease) {
      throw new NotFoundException(`Disease with id -> ${id} not found`);
    }

    this.validateDiseaseDto(updateDiseaseDto);

    try {
      const updatedDisease = await this.prismaService.disease.update({
        where: { id },
        data: {
          name: updateDiseaseDto.name.trim(),
          codeCie: updateDiseaseDto.codeCie.trim(),
          description: updateDiseaseDto.description?.trim() || null,
          diseaseGroupId: updateDiseaseDto.diseaseGroupId || null,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Disease updated successfully',
        updatedDisease,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma error for unique constraint violation
        throw new BadRequestException('Disease name or codeCie must be unique');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the disease',
      );
    }
  }
}
