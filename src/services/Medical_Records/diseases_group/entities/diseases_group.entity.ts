import { ApiProperty } from '@nestjs/swagger';

export class DiseasesGroup {
  @ApiProperty({
    type: String,
    description: 'Unique name of the disease group.',
    example: 'Respiratory Diseases',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Optional description of the disease group.',
    example: 'Group of diseases related to the respiratory system.',
    required: false,
  })
  description?: string;
}
