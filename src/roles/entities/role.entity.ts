import { ApiProperty } from '@nestjs/swagger';
export class Role {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Recepcionista',
    required: true,
  })
  role_name: string;

  @ApiProperty({
    type: String,
    description: 'This is an optional property',
    example: 'El recepcionista es el encargado de ...',
    required: false,
  })
  role_description?: string;
}
