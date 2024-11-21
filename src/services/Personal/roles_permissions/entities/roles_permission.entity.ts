import { ApiProperty } from '@nestjs/swagger';
export class RolesPermissions {
  @ApiProperty({
    type: Number,
    description: 'ID of the Role',
    example: 1,
    required: true,
  })
  roleId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the Permission',
    example: 2,
    required: true,
  })
  permissionId: number;
}
