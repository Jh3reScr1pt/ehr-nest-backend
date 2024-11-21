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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  refs,
} from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';

@ApiTags('Patients')
@Controller('patients')
@ApiSecurity('Authorization')
@ApiUnauthorizedResponse({ description: 'No autorizado' })
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create patient' })
  @ApiBody({
    schema: {
      oneOf: refs(Patient),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Patient,
    isArray: false,
  })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all patients' })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('find/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one patient' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Get('active')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all active patients' })
  activePersonal() {
    return this.patientsService.activePatients();
  }

  @Get('inactive')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inactive patients' })
  inactiveRoles() {
    return this.patientsService.inactivePatients();
  }
  @Get('ci/:ci')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get patient by CI' })
  findByCI(@Param('ci') ci: string) {
    return this.patientsService.findByCI(ci);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update patient' })
  @ApiBody({
    schema: {
      oneOf: refs(Patient),
    },
  })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Patch('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update State of patient' })
  updateState(@Param('id') id: string) {
    return this.patientsService.updateIsActive(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete patient' })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
