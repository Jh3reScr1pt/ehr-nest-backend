import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { Treatment } from './entities/treatment.entity';

@ApiTags('Treatments')
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create treatment' })
  @ApiBody({
    schema: {
      oneOf: refs(Treatment),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Treatment,
    isArray: false,
  })
  create(@Body() createTreatmentDto: CreateTreatmentDto) {
    return this.treatmentsService.create(createTreatmentDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all treatments' })
  findAll() {
    return this.treatmentsService.findAll();
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update treatment' })
  @ApiBody({
    schema: {
      oneOf: refs(Treatment),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
  ) {
    return this.treatmentsService.update(+id, updateTreatmentDto);
  }
}
