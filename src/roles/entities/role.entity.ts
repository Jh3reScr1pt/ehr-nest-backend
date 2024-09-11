import { ApiProperty } from '@nestjs/swagger';
export class Role {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  role_name: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  role_description: string;
}
