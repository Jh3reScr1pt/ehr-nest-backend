import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto/create-medical_record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical_record.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private prismaService: PrismaService) {}

  private validateCreatePersonalDto(
    createMedicalRecordDto: CreateMedicalRecordDto,
  ) {
    const fields = [
      { field: 'reason', value: createMedicalRecordDto.reason },
      { field: 'finalDiagnosis', value: createMedicalRecordDto.finalDiagnosis },
    ];

    for (const { field, value } of fields) {
      if (!value || value.trim() === '') {
        throw new BadRequestException(`${field} cannot be empty`);
      }
    }
  }
  private async checkPatientExists(patientId: number) {
    const patientExists = await this.prismaService.patients.findUnique({
      where: { id: patientId, isActive: true },
    });

    if (!patientExists) {
      throw new NotFoundException(`Patient with id -> ${patientId} not found`);
    }
  }
  private async generateMedicalRecordCode(): Promise<string> {
    const lastRecord = await this.prismaService.medicalRecord.findFirst({
      orderBy: { id: 'desc' }, // Find the most recently created record
    });

    const lastId = lastRecord?.id || 0; // Get the ID of the last record or default to 0
    const newId = lastId + 1;

    // Format the new code as "HC-XXXX" where XXXX is a zero-padded number
    return `HC-${newId.toString().padStart(4, '0')}`;
  }
  private handlePrismaError(error: any, code?: string) {
    // Handle Prisma-specific errors or other database-related issues
    if (error.code === 'P2002') {
      // Unique constraint failed (e.g., code already exists)
      throw new BadRequestException(
        `Medical record with code ${code} already exists`,
      );
    }

    // Generic fallback for unexpected errors
    throw new InternalServerErrorException(
      'An error occurred while processing your request',
    );
  }

  async create(createMedicalRecordDto: CreateMedicalRecordDto) {
    this.validateCreatePersonalDto(createMedicalRecordDto);

    await this.checkPatientExists(createMedicalRecordDto.patientId);

    const code = await this.generateMedicalRecordCode();

    try {
      await this.prismaService.medicalRecord.create({
        data: {
          ...createMedicalRecordDto,
          code,
          symptomsInformation: Array.isArray(
            createMedicalRecordDto.symptomsInformation,
          )
            ? createMedicalRecordDto.symptomsInformation.join(',')
            : undefined,
          vitalSignsInformation: Array.isArray(
            createMedicalRecordDto.vitalSignsInformation,
          )
            ? createMedicalRecordDto.vitalSignsInformation.join(',')
            : undefined,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Medical record created successfully',
      };
    } catch (error) {
      this.handlePrismaError(error, createMedicalRecordDto.code);
    }
  }

  findAll() {
    return this.prismaService.medicalRecord.findMany();
  }
  async findOne(id: number) {
    const medicalRecord = await this.prismaService.medicalRecord.findUnique({
      where: { id },
    });

    if (!medicalRecord) {
      throw new NotFoundException(`Medical record with id -> ${id}, not found`);
    }

    return {
      ...medicalRecord,
      symptomsInformation: medicalRecord.symptomsInformation
        ? medicalRecord.symptomsInformation.split(',').map((s) => {
            const [symptom, severity] = s.split('-');
            return { symptom, severity };
          })
        : [],
      vitalSignsInformation: medicalRecord.vitalSignsInformation
        ? medicalRecord.vitalSignsInformation.split(',').map((v) => {
            const [sign, value] = v.split('-');
            return { sign, value };
          })
        : [],
    };
  }

  async findAllActiveMedicalRecordsWithPatients() {
    const medicalRecords = await this.prismaService.medicalRecord.findMany({
      where: {
        isActive: true,
        patient: { isActive: true },
      },
      include: {
        patient: true,
      },
    });

    if (!medicalRecords.length) {
      throw new NotFoundException(
        'No active medical records with active patients found',
      );
    }

    return medicalRecords.map((record) => ({
      medicalRecordId: record.id,
      code: record.code,
      reason: record.reason,
      finalDiagnosis: record.finalDiagnosis,
      symptoms: record.symptomsInformation
        ? record.symptomsInformation.split(',').map((s) => {
            const [symptom, severity] = s.split('-');
            return { symptom, severity };
          })
        : [],
      vitalSigns: record.vitalSignsInformation
        ? record.vitalSignsInformation.split(',').map((v) => {
            const [sign, value] = v.split('-');
            return { sign, value };
          })
        : [],
      patient: {
        id: record.patient.id,
        fullName: `${record.patient.first_name} ${record.patient.second_name || ''} ${record.patient.first_last_name} ${record.patient.second_last_name}`,
        ci: record.patient.ci,
        phone_number: record.patient.phone_number,
        address: record.patient.address,
        age: record.patient.age,
        birth_date: record.patient.birth_date,
      },
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  }

  async findMedicalRecordWithPatientDetails(medicalRecordId: number) {
    const medicalRecord = await this.prismaService.medicalRecord.findUnique({
      where: { id: Number(medicalRecordId) },
      include: {
        patient: true, // Incluir los datos del paciente
        treatments: true, // Incluir tratamientos relacionados
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException(
        `Medical record with ID ${medicalRecordId} not found`,
      );
    }

    return {
      medicalRecordId: medicalRecord.id,
      code: medicalRecord.code,
      reason: medicalRecord.reason,
      finalDiagnosis: medicalRecord.finalDiagnosis,
      symptoms: medicalRecord.symptomsInformation
        ? medicalRecord.symptomsInformation.split(',').map((s) => {
            const [symptom, severity] = s.split('-');
            return { symptom, severity };
          })
        : [],
      vitalSigns: medicalRecord.vitalSignsInformation
        ? medicalRecord.vitalSignsInformation.split(',').map((v) => {
            const [sign, value] = v.split('-');
            return { sign, value };
          })
        : [],
      patient: {
        id: medicalRecord.patient.id,
        fullName: `${medicalRecord.patient.first_name} ${medicalRecord.patient.second_name || ''} ${medicalRecord.patient.first_last_name} ${medicalRecord.patient.second_last_name}`,
        ci: medicalRecord.patient.ci,
        phone_number: medicalRecord.patient.phone_number,
        address: medicalRecord.patient.address,
        age: medicalRecord.patient.age,
        birth_date: medicalRecord.patient.birth_date,
      },
      treatments: medicalRecord.treatments.map((treatment) => ({
        id: treatment.id,
        medication: treatment.medication,
        notes: treatment.notes,
      })),
      createdAt: medicalRecord.createdAt,
      updatedAt: medicalRecord.updatedAt,
    };
  }

  async activeMedicalRecords() {
    const activeMedicalRecord = await this.prismaService.medicalRecord.findMany(
      {
        where: { isActive: true },
      },
    );

    if (activeMedicalRecord.length === 0) {
      throw new NotFoundException('No active medical record found');
    }

    return activeMedicalRecord;
  }

  async inactiveMedicalRecords() {
    const inactiveMedicalRecord =
      await this.prismaService.medicalRecord.findMany({
        where: { isActive: false },
      });

    if (inactiveMedicalRecord.length === 0) {
      throw new NotFoundException('No inactive medical record found');
    }

    return inactiveMedicalRecord;
  }

  async update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    const medicalRecordFound =
      await this.prismaService.medicalRecord.findUnique({
        where: { id },
      });

    if (!medicalRecordFound) {
      throw new NotFoundException(`Personal with id -> ${id}, not found`);
    }

    try {
      await this.prismaService.medicalRecord.update({
        where: { id },
        data: updateMedicalRecordDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Medical record updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Medical record with id -> ${id}, not found`,
        );
      }
      throw error;
    }
  }

  async updateIsActive(id: number) {
    const medicalRecordFound =
      await this.prismaService.medicalRecord.findUnique({
        where: { id },
      });

    if (!medicalRecordFound) {
      throw new NotFoundException(`Medical record with id "${id}" not found`);
    }

    const newState = !medicalRecordFound.isActive;

    await this.prismaService.medicalRecord.update({
      where: { id },
      data: { isActive: newState },
    });

    const message = newState
      ? `Medical record has been activated successfully`
      : `Medical record has been deactivated successfully`;

    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }

  async remove(id: number) {
    const medicalRecordFound =
      await this.prismaService.medicalRecord.findUnique({
        where: { id },
      });

    if (!medicalRecordFound) {
      throw new NotFoundException(`Medical record with id "${id}" not found`);
    }

    if (medicalRecordFound.isActive) {
      throw new ConflictException(
        'Medical record cannot be deleted while active',
      );
    }

    await this.prismaService.medicalRecord.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Medical record with id "${id}" deleted successfully`,
    };
  }
}
