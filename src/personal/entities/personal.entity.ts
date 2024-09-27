import { ApiProperty } from '@nestjs/swagger';
export class Personal {
  @ApiProperty({
    type: String,
    description: 'First name of the person. This is a required property.',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    type: String,
    description: 'Second name of the person. This is an optional property.',
    example: 'Doe',
    required: false,
  })
  second_name?: string;

  @ApiProperty({
    type: String,
    description: 'First last name of the person. This is a required property.',
    example: 'Smith',
    required: true,
  })
  first_last_name: string;

  @ApiProperty({
    type: String,
    description: 'Second last name of the person. This is a required property.',
    example: 'Johnson',
    required: true,
  })
  second_last_name: string;
  @ApiProperty({
    type: String,
    description: 'Phone number of the person. This is an optional property.',
    example: '+123456789',
    required: false,
  })
  phone_number?: string;

  @ApiProperty({
    type: String,
    description: 'Email of the person. This field must be unique.',
    example: 'john.doe@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of the person. This field must be unique.',
    example: '54321',
    required: true,
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'CI of the person. This field must be unique.',
    example: '12345678',
    required: true,
  })
  ci: string;

  @ApiProperty({
    type: Number,
    description: 'Role identifier for the personal',
    example: 1,
  })
  roleId: number;
}
