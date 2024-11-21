import { ApiProperty } from '@nestjs/swagger';

export class Disease {
  @ApiProperty({
    type: Number,
    description:
      'Identifier of the disease associated with some diseases group.',
    example: 1,
  })
  diseaseGroupId: number;
  @ApiProperty({
    type: String,
    description: 'Unique CIE-10 code of the disease.',
    example: 'J45',
  })
  codeCie: string;

  @ApiProperty({
    type: String,
    description: 'Unique name of the disease.',
    example: 'Asthma',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Optional description of the disease.',
    example:
      'A condition in which a person’s airways become inflamed, narrow, and swell.',
    required: false,
  })
  description?: string;
}
