import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { MedicalAppointmentsService } from './medical_appointments.service';
import { CreateMedicalAppointmentDto } from './dto/create-medical_appointment.dto';
import { UpdateMedicalAppointmentDto } from './dto/update-medical_appointment.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { MedicalAppointment } from './entities/medical_appointment.entity';

@ApiTags('Medical Appointments')
@Controller('medical-appointments')
export class MedicalAppointmentsController {
  constructor(
    private readonly medicalAppointmentsService: MedicalAppointmentsService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register medical appointment' })
  @ApiBody({
    schema: {
      oneOf: refs(MedicalAppointment),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: MedicalAppointment,
    isArray: false,
  })
  create(@Body() createMedicalAppointmentDto: CreateMedicalAppointmentDto) {
    return this.medicalAppointmentsService.create(createMedicalAppointmentDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all medical appointments' })
  findAll() {
    return this.medicalAppointmentsService.findAll();
  }

  @Get('find/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one medical appointment' })
  findOne(@Param('id') id: string) {
    return this.medicalAppointmentsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update medical appointment' })
  @ApiBody({
    schema: {
      oneOf: refs(MedicalAppointment),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateMedicalAppointmentDto: UpdateMedicalAppointmentDto,
  ) {
    return this.medicalAppointmentsService.update(
      +id,
      updateMedicalAppointmentDto,
    );
  }
  @Patch('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update State of medical appointment' })
  updateState(@Param('id') id: string) {
    return this.medicalAppointmentsService.updateIsActive(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete medical appointment' })
  remove(@Param('id') id: string) {
    return this.medicalAppointmentsService.remove(+id);
  }
}
