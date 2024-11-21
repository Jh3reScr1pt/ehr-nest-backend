import { ApiProperty } from '@nestjs/swagger';
export class Permission {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Admin. Personal',
    required: true,
  })
  permission_name: string;

  @ApiProperty({
    type: String,
    description: 'This is an optional property',
    example: 'El Admin. Personal puede ver...',
    required: false,
  })
  permission_description?: string;
}
