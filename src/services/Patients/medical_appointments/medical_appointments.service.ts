import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicalAppointmentDto } from './dto/create-medical_appointment.dto';
import { UpdateMedicalAppointmentDto } from './dto/update-medical_appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicalAppointmentsService {
  constructor(private prismaService: PrismaService) {}

  private async checkDoctorExists(doctorId: number) {
    const doctorExists = await this.prismaService.personal.findUnique({
      where: { id: doctorId },
    });

    if (!doctorExists) {
      throw new NotFoundException(`Doctor with id -> ${doctorId} not found`);
    }
  }
  private async checkPatientExists(patientId: number) {
    const roleExists = await this.prismaService.patients.findUnique({
      where: { id: patientId },
    });

    if (!roleExists) {
      throw new NotFoundException(`Patient with id -> ${patientId} not found`);
    }
  }
  private async checkAvailableDateTime(
    doctorId: number,
    date_appointment: Date,
    start_time: string,
  ) {
    const parsedDateAppointment = new Date(date_appointment); // Conversión a objeto Date

    const appointmentAvailableExists =
      await this.prismaService.medicalAppointment.findFirst({
        where: {
          doctorId: doctorId,
          date_appointment: parsedDateAppointment,
          start_time: start_time,
          isActive: true,
        },
      });

    if (appointmentAvailableExists) {
      throw new ConflictException(
        'There is already an existing medical appointment at this date and time',
      );
    }
  }

  async create(createMedicalAppointmentDto: CreateMedicalAppointmentDto) {
    await this.checkDoctorExists(createMedicalAppointmentDto.doctorId);
    await this.checkPatientExists(createMedicalAppointmentDto.patientId);

    // Asegurarse de que date_appointment sea un objeto Date válido
    const parsedDateAppointment = new Date(
      createMedicalAppointmentDto.date_appointment,
    );

    await this.checkAvailableDateTime(
      createMedicalAppointmentDto.doctorId,
      parsedDateAppointment,
      createMedicalAppointmentDto.start_time,
    );

    try {
      await this.prismaService.medicalAppointment.create({
        data: {
          ...createMedicalAppointmentDto,
          date_appointment: parsedDateAppointment, // Aquí se usa la fecha convertida
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Medical Appointment registered successfully',
      };
    } catch (error) {
      throw new ConflictException(
        'Error creating appointment: ' + error.message,
      );
    }
  }

  findAll() {
    return this.prismaService.medicalAppointment.findMany({
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  async findOne(id: number) {
    const appointmentFound =
      await this.prismaService.medicalAppointment.findUnique({
        where: { id: id },
      });
    if (!appointmentFound) {
      throw new NotFoundException(`Appointment with id -> ${id}, not found`);
    }
    return appointmentFound;
  }

  async update(
    id: number,
    updateMedicalAppointmentDto: UpdateMedicalAppointmentDto,
  ) {
    const appointmentFound =
      await this.prismaService.medicalAppointment.findUnique({
        where: { id },
      });
    if (!appointmentFound) {
      throw new NotFoundException(`Appointment with id -> ${id}, not found`);
    }
    try {
      await this.prismaService.medicalAppointment.update({
        where: { id },
        data: updateMedicalAppointmentDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Appointment updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Appointment with id -> ${id}, not found`);
      }
      throw error;
    }
  }
  async updateIsActive(id: number) {
    const appointmentFound =
      await this.prismaService.medicalAppointment.findUnique({
        where: { id },
      });

    if (!appointmentFound) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }

    const newState = !appointmentFound.isActive;

    await this.prismaService.medicalAppointment.update({
      where: { id },
      data: { isActive: newState },
    });

    const message = newState
      ? `Appointment has been activated successfully`
      : `appointment has been deactivated successfully`;

    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }

  async remove(id: number) {
    const appointmentFound = await this.prismaService.personal.findUnique({
      where: { id },
    });

    if (!appointmentFound) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }

    if (appointmentFound.isActive) {
      throw new ConflictException('Appointment cannot be deleted while active');
    }

    await this.prismaService.personal.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Appointment with id "${id}" deleted successfully`,
    };
  }
}
