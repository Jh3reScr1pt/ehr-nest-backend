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
import { MedicalRecordsService } from './medical_records.service';
import { CreateMedicalRecordDto } from './dto/create-medical_record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical_record.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { MedicalRecord } from './entities/medical_record.entity';

@ApiTags('Medical Record')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create medical record' })
  @ApiBody({
    schema: {
      oneOf: refs(MedicalRecord),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: MedicalRecord,
    isArray: false,
  })
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all medical records' })
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get('find/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one medical record' })
  findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(+id);
  }
  @Get('active')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all active medical records' })
  activeMedicalRecords() {
    return this.medicalRecordsService.activeMedicalRecords();
  }
  @Get('inactive')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inactive medical records' })
  inactiveMedicalRecords() {
    return this.medicalRecordsService.inactiveMedicalRecords();
  }

  @Get('medical_record_patient/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get medical record with patients info' })
  findMedicalRecordWithPatientDetails(@Param('id') id: number) {
    return this.medicalRecordsService.findMedicalRecordWithPatientDetails(id);
  }
  @Get('medical_records_patients')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get medical record with patients info' })
  findAllActiveMedicalRecordsWithPatients() {
    return this.medicalRecordsService.findAllActiveMedicalRecordsWithPatients();
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update medical record' })
  @ApiBody({
    schema: {
      oneOf: refs(MedicalRecord),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.update(+id, updateMedicalRecordDto);
  }

  @Patch('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update State of medical record' })
  updateState(@Param('id') id: string) {
    return this.medicalRecordsService.updateIsActive(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete medical record' })
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(+id);
  }
}
