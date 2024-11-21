import { ApiProperty } from '@nestjs/swagger';

export class Treatment {
  @ApiProperty({
    type: Number,
    description:
      'Identifier of the medical record associated with the treatment.',
    example: 101,
  })
  medicalRecordId: number;

  @ApiProperty({
    type: String,
    description: 'Name of the medication used in the treatment.',
    example: 'Paracetamol',
  })
  medication: string;

  @ApiProperty({
    type: String,
    description: 'Additional notes about the treatment.',
    example: 'Administer 500mg twice daily after meals.',
    required: false,
  })
  notes?: string;
}
