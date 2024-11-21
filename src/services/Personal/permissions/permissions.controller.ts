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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { Permission } from './entities/permission.entity';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create permission' })
  @ApiBody({
    schema: {
      oneOf: refs(Permission),
    },
  })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: Permission,
    isArray: false,
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all permissions' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('find/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one permission' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Get('active')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all active permissions' })
  activeRoles() {
    return this.permissionsService.activePermissions();
  }

  @Get('inactive')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inactive permissions' })
  inactiveRoles() {
    return this.permissionsService.inactivePermissions();
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update persmission' })
  @ApiBody({
    schema: {
      oneOf: refs(Permission),
    },
  })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Patch('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update State of permission' })
  updateState(@Param('id') id: string) {
    return this.permissionsService.updateIsActive(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete permission' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
