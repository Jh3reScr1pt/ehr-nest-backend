import { ApiProperty } from '@nestjs/swagger';

export class Diagnosis {
  @ApiProperty({
    type: Number,
    description:
      'Identifier of the medical record associated with the diagnosis.',
    example: 1,
  })
  medicalRecordId: number;

  @ApiProperty({
    type: Number,
    description:
      'Identifier of the disease group associated with the diagnosis.',
    example: 5,
  })
  diseaseGroupId: number;

  @ApiProperty({
    type: Number,
    description: 'Probability associated with the presumptive diagnosis.',
    example: 93.5,
  })
  probability: number;
}
