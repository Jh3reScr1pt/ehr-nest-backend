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
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { Specialty } from './entities/specialty.entity';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create specialty' })
  @ApiBody({
    schema: {
      oneOf: refs(Specialty),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Specialty,
    isArray: false,
  })
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtiesService.create(createSpecialtyDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all specialties' })
  findAll() {
    return this.specialtiesService.findAll();
  }

  @Get('find/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one specialty' })
  findOne(@Param('id') id: string) {
    return this.specialtiesService.findOne(+id);
  }

  @Get('active')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all active specialties' })
  activeSpecialties() {
    return this.specialtiesService.activeSpecialties();
  }

  @Get('inactive')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inactive specialties' })
  inactiveSpecialties() {
    return this.specialtiesService.inactiveSpecialties();
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update specialty' })
  @ApiBody({
    schema: {
      oneOf: refs(Specialty),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ) {
    return this.specialtiesService.update(+id, updateSpecialtyDto);
  }

  @Patch('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update State of specialty' })
  updateState(@Param('id') id: string) {
    return this.specialtiesService.updateIsActive(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete specialty' })
  remove(@Param('id') id: string) {
    return this.specialtiesService.remove(+id);
  }
}
