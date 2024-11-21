import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';

@Injectable()
export class DiagnosisService {
  constructor(private prismaService: PrismaService) {}

  private validateDiagnosisDto(createDiagnosisDto: CreateDiagnosisDto) {
    const fields = [
      {
        field: 'probability',
        value: createDiagnosisDto.probability.toString(),
      },
      { field: 'diseaseGroupId', value: createDiagnosisDto.diseaseGroupId },
      { field: 'medicalRecordId', value: createDiagnosisDto.medicalRecordId },
    ];

    for (const { field, value } of fields) {
      if (value === undefined || value === null || value === '') {
        throw new BadRequestException(`${field} cannot be empty`);
      }
    }

    const probability = Number(createDiagnosisDto.probability); // Conversión explícita
    if (probability < 0 || probability > 100) {
      throw new BadRequestException('Probability must be between 0 and 100');
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

  private async checkDiseaseGroupExists(diseaseGroupId: number) {
    const groupExists = await this.prismaService.diseaseGroup.findUnique({
      where: { id: diseaseGroupId },
    });

    if (!groupExists) {
      throw new NotFoundException(
        `Disease group with id -> ${diseaseGroupId} not found`,
      );
    }
  }

  async create(createDiagnosisDto: CreateDiagnosisDto) {
    this.validateDiagnosisDto(createDiagnosisDto);

    await this.checkMedicalRecordExists(createDiagnosisDto.medicalRecordId);
    await this.checkDiseaseGroupExists(createDiagnosisDto.diseaseGroupId);

    try {
      const diagnosis = await this.prismaService.diagnosis.create({
        data: {
          probability: Number(createDiagnosisDto.probability), // Conversión explícita
          diseaseGroupId: createDiagnosisDto.diseaseGroupId,
          medicalRecordId: createDiagnosisDto.medicalRecordId,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Diagnosis created successfully',
        diagnosis,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the diagnosis',
      );
    }
  }
  findAll() {
    return this.prismaService.diagnosis.findMany();
  }
  async findByMedicalRecordId(medicalRecordId: number) {
    await this.checkMedicalRecordExists(medicalRecordId);

    const diagnoses = await this.prismaService.diagnosis.findMany({
      where: { medicalRecordId },
      include: {
        diseaseGroup: true, // Incluir detalles del grupo de enfermedades
      },
    });

    if (!diagnoses || diagnoses.length === 0) {
      throw new NotFoundException(
        `No diagnoses found for medical record with id -> ${medicalRecordId}`,
      );
    }

    return diagnoses.map((diagnosis) => ({
      id: diagnosis.id,
      medicalRecordId: diagnosis.medicalRecordId,
      diseaseGroup: {
        id: diagnosis.diseaseGroup.id,
        name: diagnosis.diseaseGroup.name,
        description: diagnosis.diseaseGroup.description,
      },
      probability: Number(diagnosis.probability), // Conversión explícita
      createdAt: diagnosis.createdAt,
      updatedAt: diagnosis.updatedAt,
    }));
  }

  async update(id: number, updateDiagnosisDto: UpdateDiagnosisDto) {
    const diagnosis = await this.prismaService.diagnosis.findUnique({
      where: { id },
    });

    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with id -> ${id} not found`);
    }

    if (updateDiagnosisDto.medicalRecordId) {
      await this.checkMedicalRecordExists(updateDiagnosisDto.medicalRecordId);
    }

    if (updateDiagnosisDto.diseaseGroupId) {
      await this.checkDiseaseGroupExists(updateDiagnosisDto.diseaseGroupId);
    }

    const updatedData: any = { ...updateDiagnosisDto };
    if (updateDiagnosisDto.probability !== undefined) {
      const probability = Number(updateDiagnosisDto.probability); // Conversión explícita
      if (probability < 0 || probability > 100) {
        throw new BadRequestException('Probability must be between 0 and 100');
      }
      updatedData.probability = probability;
    }

    try {
      const updatedDiagnosis = await this.prismaService.diagnosis.update({
        where: { id },
        data: updatedData,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Diagnosis updated successfully',
        updatedDiagnosis,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the diagnosis',
      );
    }
  }
}
