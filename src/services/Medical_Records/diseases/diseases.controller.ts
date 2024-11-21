import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { Disease } from './entities/disease.entity';

@ApiTags('Diseases')
@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create medical record' })
  @ApiBody({
    schema: {
      oneOf: refs(Disease),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Disease,
    isArray: false,
  })
  create(@Body() createDiseaseDto: CreateDiseaseDto) {
    return this.diseasesService.create(createDiseaseDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all diseases' })
  findAll() {
    return this.diseasesService.findAll();
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update disease' })
  @ApiBody({
    schema: {
      oneOf: refs(Disease),
    },
  })
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    return this.diseasesService.update(+id, updateDiseaseDto);
  }
}
