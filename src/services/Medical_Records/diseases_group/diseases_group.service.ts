import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiseasesGroupDto } from './dto/create-diseases_group.dto';
import { UpdateDiseasesGroupDto } from './dto/update-diseases_group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiseasesGroupService {
  constructor(private prismaService: PrismaService) {}

  private validateDiseaseGroupDto(
    data: CreateDiseasesGroupDto | UpdateDiseasesGroupDto,
  ) {
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException('Disease group name cannot be empty');
    }
  }

  async create(createDiseaseGroupDto: CreateDiseasesGroupDto) {
    this.validateDiseaseGroupDto(createDiseaseGroupDto);

    try {
      const diseaseGroup = await this.prismaService.diseaseGroup.create({
        data: {
          name: createDiseaseGroupDto.name.trim(),
          description: createDiseaseGroupDto.description?.trim() || null,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Disease group created successfully',
        diseaseGroup,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma error for unique constraint violation
        throw new BadRequestException('Disease group name must be unique');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the disease group',
      );
    }
  }

  async findByName(name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Disease group name cannot be empty');
    }

    try {
      const diseaseGroup = await this.prismaService.diseaseGroup.findUnique({
        where: { name: name.trim() },
      });

      if (!diseaseGroup) {
        throw new NotFoundException(
          `Disease group with name "${name}" not found`,
        );
      }

      return {
        id: diseaseGroup.id,
        name: diseaseGroup.name,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while searching for the disease group',
      );
    }
  }

  async update(id: number, updateDiseasesGroupDto: UpdateDiseasesGroupDto) {
    this.validateDiseaseGroupDto(updateDiseasesGroupDto);

    const existingDiseaseGroup =
      await this.prismaService.diseaseGroup.findUnique({
        where: { id },
      });

    if (!existingDiseaseGroup) {
      throw new NotFoundException(`Disease group with id -> ${id} not found`);
    }

    try {
      const updatedDiseaseGroup = await this.prismaService.diseaseGroup.update({
        where: { id },
        data: {
          name: updateDiseasesGroupDto.name.trim(),
          description: updateDiseasesGroupDto.description?.trim() || null,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Disease group updated successfully',
        updatedDiseaseGroup,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma error for unique constraint violation
        throw new BadRequestException('Disease group name must be unique');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the disease group',
      );
    }
  }

  async findAll() {
    try {
      const diseaseGroups = await this.prismaService.diseaseGroup.findMany({
        include: {
          diseases: true, // Incluir las enfermedades relacionadas
        },
      });

      if (!diseaseGroups || diseaseGroups.length === 0) {
        throw new NotFoundException('No disease groups found');
      }

      return diseaseGroups.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        diseases: group.diseases.map((disease) => ({
          id: disease.id,
          name: disease.name,
          codeCie: disease.codeCie,
        })),
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      }));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching disease groups',
      );
    }
  }
}
