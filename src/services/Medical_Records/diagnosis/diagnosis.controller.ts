import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { Diagnosis } from './entities/diagnosis.entity';

@ApiTags('Diagnosis')
@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create diagnosis' })
  @ApiBody({
    schema: {
      oneOf: refs(Diagnosis),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Diagnosis,
    isArray: false,
  })
  create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return this.diagnosisService.create(createDiagnosisDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all diagnosis' })
  findAll() {
    return this.diagnosisService.findAll();
  }

  @Get('medical_record_diagnosis/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one diagnosis from a medical record' })
  findByMedicalRecordId(@Param('id') id: string) {
    return this.diagnosisService.findByMedicalRecordId(+id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update diagnosis' })
  @ApiBody({
    schema: {
      oneOf: refs(Diagnosis),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
  ) {
    return this.diagnosisService.update(+id, updateDiagnosisDto);
  }
}
