import { ApiProperty } from '@nestjs/swagger';

export class MedicalRecord {
  @ApiProperty({
    type: Number,
    description:
      'Identifier of the patient associated with the medical record.',
    example: 1,
  })
  patientId: number;

  @ApiProperty({
    type: String,
    description: 'Reason for the consultation.',
    example: 'Persistent headache and nausea.',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    type: String,
    description: 'Final diagnosis provided by the doctor.',
    example: 'Migraine with aura.',
    required: false,
  })
  finalDiagnosis?: string;

  @ApiProperty({
    type: [String],
    description: 'Symptoms information in the format "symptom-severity".',
    example: 'Tos-Alta,Fatiga-Media',
    required: false,
  })
  symptomsInformation?: string[];

  @ApiProperty({
    type: [String],
    description: 'Vital signs information in the format "sign-value".',
    example: 'Temperature-37.5, HeartRate-80',
    required: false,
  })
  vitalSignsInformation?: string[];
}
