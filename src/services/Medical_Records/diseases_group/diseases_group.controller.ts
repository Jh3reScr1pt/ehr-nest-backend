import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { DiseasesGroupService } from './diseases_group.service';
import { CreateDiseasesGroupDto } from './dto/create-diseases_group.dto';
import { UpdateDiseasesGroupDto } from './dto/update-diseases_group.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { DiseasesGroup } from './entities/diseases_group.entity';

@ApiTags('Diseases Group')
@Controller('diseases-group')
export class DiseasesGroupController {
  constructor(private readonly diseasesGroupService: DiseasesGroupService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create diseases group' })
  @ApiBody({
    schema: {
      oneOf: refs(DiseasesGroup),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: DiseasesGroup,
    isArray: false,
  })
  create(@Body() createDiseasesGroupDto: CreateDiseasesGroupDto) {
    return this.diseasesGroupService.create(createDiseasesGroupDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all diseases groups' })
  findAll() {
    return this.diseasesGroupService.findAll();
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update diseases group' })
  @ApiBody({
    schema: {
      oneOf: refs(DiseasesGroup),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDiseasesGroupDto: UpdateDiseasesGroupDto,
  ) {
    return this.diseasesGroupService.update(+id, updateDiseasesGroupDto);
  }
}
