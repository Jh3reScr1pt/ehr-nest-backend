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
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { Personal } from './entities/personal.entity';

@ApiTags('Personal')
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create personal' })
  @ApiBody({
    schema: {
      oneOf: refs(Personal),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Personal,
    isArray: false,
  })
  create(@Body() createPersonalDto: CreatePersonalDto) {
    return this.personalService.create(createPersonalDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all personal' })
  findAll() {
    return this.personalService.findAll();
  }

  @Get('find/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one personal' })
  findOne(@Param('id') id: string) {
    return this.personalService.findOne(+id);
  }

  @Get('active')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all active personal' })
  activePersonal() {
    return this.personalService.activePersonal();
  }

  @Get('inactive')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inactive personal' })
  inactivePersonal() {
    return this.personalService.inactivePersonal();
  }

  @Get('email/:email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get personal by email' })
  findByEmail(@Param('email') email: string) {
    return this.personalService.findByEmail(email);
  }
  // Nuevo endpoint para buscar por CI
  @Get('ci/:ci')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get personal by CI' })
  findByCI(@Param('ci') ci: string) {
    return this.personalService.findByCI(ci);
  }
  @Get('roles_permissions/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get role with permissions' })
  findRoleWithPermissions(@Param('id') id: number) {
    return this.personalService.findRoleWithPermissions(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update personal' })
  @ApiBody({
    schema: {
      oneOf: refs(Personal),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updatePersonalDto: UpdatePersonalDto,
  ) {
    return this.personalService.update(+id, updatePersonalDto);
  }

  @Patch('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update State of personal' })
  updateState(@Param('id') id: string) {
    return this.personalService.updateIsActive(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete personal' })
  remove(@Param('id') id: string) {
    return this.personalService.remove(+id);
  }

  @Get('password/:email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get email and hashed password of personal' })
  getLoginInfo(@Param('email') email: string) {
    return this.personalService.getLoginInfo(email);
  }
}
