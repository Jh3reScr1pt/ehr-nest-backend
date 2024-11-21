import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PatientsService {
  constructor(private prismaService: PrismaService) {}
  private validateCreatePatientDto(createPatientDto: CreatePatientDto) {
    const fields = [
      { field: 'first_name', value: createPatientDto.first_name },
      { field: 'first_last_name', value: createPatientDto.first_last_name },
      { field: 'second_last_name', value: createPatientDto.second_last_name },
      { field: 'ci', value: createPatientDto.ci },
      { field: 'phone_number', value: createPatientDto.phone_number },
      { field: 'address', value: createPatientDto.address },
    ];

    for (const { field, value } of fields) {
      if (!value || value.trim() === '') {
        throw new BadRequestException(`${field} cannot be empty`);
      }
    }
  }
  private handlePrismaError(error: any, ci: string) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new ConflictException(`Personal with ci -> ${ci} already exists`);
    }
    throw error;
  }
  private calculateAge(birth_date: Date): number {
    const today = new Date();
    const birthDate = new Date(birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
  async create(createPatientDto: CreatePatientDto) {
    this.validateCreatePatientDto(createPatientDto);

    // Asegúrate de que `birth_date` sea un objeto `Date`
    const birthDate = new Date(createPatientDto.birth_date);

    // Calcular la edad antes de la creación del paciente
    const age = this.calculateAge(birthDate);

    try {
      await this.prismaService.patients.create({
        data: {
          ...createPatientDto,
          birth_date: birthDate, // Asegurarse de que sea de tipo `Date`
          age, // Se agrega la edad calculada al paciente
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Patient created successfully',
      };
    } catch (error) {
      this.handlePrismaError(error, createPatientDto.ci);
    }
  }

  findAll() {
    return this.prismaService.patients.findMany();
  }
  async findOne(id: number) {
    const patientFound = await this.prismaService.patients.findUnique({
      where: { id: id },
    });
    if (!patientFound) {
      throw new NotFoundException(`Patient with id -> ${id}, not found`);
    }
    return patientFound;
  }
  async findByCI(ci: string) {
    const patient = await this.prismaService.patients.findUnique({
      where: { ci },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with CI -> ${ci}, not found`);
    }

    return patient;
  }
  async activePatients() {
    const activePatients = await this.prismaService.patients.findMany({
      where: { isActive: true },
    });

    if (activePatients.length === 0) {
      throw new NotFoundException('No active patients found');
    }

    return activePatients;
  }

  async inactivePatients() {
    const inactivePatients = await this.prismaService.patients.findMany({
      where: { isActive: false },
    });

    if (inactivePatients.length === 0) {
      throw new NotFoundException('No inactive patients found');
    }

    return inactivePatients;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    // Asegúrate de que `birth_date` sea un objeto `Date`
    const birthDate = new Date(updatePatientDto.birth_date);

    // Calcular la edad antes de la actualización del paciente
    const age = this.calculateAge(birthDate);

    try {
      await this.prismaService.patients.update({
        where: { id },
        data: {
          ...updatePatientDto,
          birth_date: birthDate, // Asegurarse de que sea de tipo `Date`
          age, // Se agrega la edad calculada al paciente
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Patient updated successfully',
      };
    } catch (error) {
      this.handlePrismaError(error, updatePatientDto.ci);
    }
  }

  async updateIsActive(id: number) {
    const patientFound = await this.prismaService.patients.findUnique({
      where: { id },
    });

    if (!patientFound) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }

    const newState = !patientFound.isActive;

    await this.prismaService.patients.update({
      where: { id },
      data: { isActive: newState },
    });

    const message = newState
      ? `Patient has been activated successfully`
      : `Patient has been deactivated successfully`;

    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }

  async remove(id: number) {
    const patientFound = await this.prismaService.patients.findUnique({
      where: { id },
    });

    if (!patientFound) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }

    if (patientFound.isActive) {
      throw new ConflictException('Patient cannot be deleted while active');
    }

    await this.prismaService.patients.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Patient with id "${id}" deleted successfully`,
    };
  }
}
