import { ApiProperty } from '@nestjs/swagger';
export class Specialty {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Ginecología',
    required: true,
  })
  specialty_name: string;

  @ApiProperty({
    type: String,
    description: 'This is an optional property',
    example: 'El ginecólogo es el encargado de ...',
    required: false,
  })
  specialty_description: string;
}
