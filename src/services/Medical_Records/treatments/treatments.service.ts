import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(private prismaService: PrismaService) {}

  private validateTreatmentDto(data: CreateTreatmentDto | UpdateTreatmentDto) {
    if (!data.medication || data.medication.trim() === '') {
      throw new BadRequestException('Medication name cannot be empty');
    }
    if (!data.medicalRecordId) {
      throw new BadRequestException('MedicalRecordId is required');
    }
  }

  private async checkMedicalRecordExists(medicalRecordId: number) {
    const recordExists = await this.prismaService.medicalRecord.findUnique({
      where: { id: medicalRecordId },
    });

    if (!recordExists) {
      throw new NotFoundException(
        `Medical record with id -> ${medicalRecordId} not found`,
      );
    }
  }

  async create(createTreatmentDto: CreateTreatmentDto) {
    this.validateTreatmentDto(createTreatmentDto);

    await this.checkMedicalRecordExists(createTreatmentDto.medicalRecordId);

    try {
      const treatment = await this.prismaService.treatment.create({
        data: {
          medicalRecordId: createTreatmentDto.medicalRecordId,
          medication: createTreatmentDto.medication.trim(),
          notes: createTreatmentDto.notes?.trim() || null,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Treatment created successfully',
        treatment,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the treatment',
      );
    }
  }

  async findAll() {
    try {
      const treatments = await this.prismaService.treatment.findMany({
        include: {
          medicalRecord: true, // Incluye detalles de la historia clínica asociada
        },
      });

      if (!treatments || treatments.length === 0) {
        throw new NotFoundException('No treatments found');
      }

      return treatments.map((treatment) => ({
        id: treatment.id,
        medication: treatment.medication,
        notes: treatment.notes,
        medicalRecord: {
          id: treatment.medicalRecord.id,
          code: treatment.medicalRecord.code,
        },
        createdAt: treatment.createdAt,
        updatedAt: treatment.updatedAt,
      }));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching treatments',
      );
    }
  }

  async update(id: number, updateTreatmentDto: UpdateTreatmentDto) {
    const existingTreatment = await this.prismaService.treatment.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      throw new NotFoundException(`Treatment with id -> ${id} not found`);
    }

    if (updateTreatmentDto.medicalRecordId) {
      await this.checkMedicalRecordExists(updateTreatmentDto.medicalRecordId);
    }

    this.validateTreatmentDto(updateTreatmentDto);

    try {
      const updatedTreatment = await this.prismaService.treatment.update({
        where: { id },
        data: {
          medicalRecordId: updateTreatmentDto.medicalRecordId,
          medication: updateTreatmentDto.medication.trim(),
          notes: updateTreatmentDto.notes?.trim() || null,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Treatment updated successfully',
        updatedTreatment,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the treatment',
      );
    }
  }
  async remove(id: number) {
    const treatmentFound = await this.prismaService.treatment.findUnique({
      where: { id },
    });

    if (!treatmentFound) {
      throw new NotFoundException(`Treatment with id "${id}" not found`);
    }

    await this.prismaService.treatment.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Treatment with id "${id}" deleted successfully`,
    };
  }
}
