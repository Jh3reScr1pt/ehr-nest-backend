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
import { RolesPermissionsService } from './roles_permissions.service';
import { CreateRolesPermissionsDto } from './dto/create-roles_permission.dto';
import { UpdateRolesPermissionsDto } from './dto/update-roles_permission.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger'; // Assuming you have an entity defined
import { RolesPermissions } from './entities/roles_permission.entity';

@ApiTags('RolesPermissions')
@Controller('roles-permissions')
export class RolesPermissionsController {
  constructor(
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiBody({
    schema: {
      oneOf: refs(RolesPermissions),
    },
  })
  @ApiCreatedResponse({
    description: 'RolePermission created successfully',
    type: RolesPermissions,
    isArray: false,
  })
  create(@Body() createDto: CreateRolesPermissionsDto) {
    return this.rolesPermissionsService.create(createDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all roles-permissions assignments' })
  findAll() {
    return this.rolesPermissionsService.findAll();
  }

  @Get(':roleId/:permissionId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one roles-permissions assignment' })
  findOne(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesPermissionsService.findOne(+roleId, +permissionId);
  }

  @Patch(':roleId/:permissionId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a role-permission assignment' })
  @ApiBody({
    schema: {
      oneOf: refs(RolesPermissions),
    },
  })
  update(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
    @Body() updateDto: UpdateRolesPermissionsDto,
  ) {
    return this.rolesPermissionsService.update(
      +roleId,
      +permissionId,
      updateDto,
    );
  }

  @Delete(':roleId/:permissionId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a permission from a role' })
  remove(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesPermissionsService.remove(+roleId, +permissionId);
  }
}
