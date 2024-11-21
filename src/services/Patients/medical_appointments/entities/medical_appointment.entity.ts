import { ApiProperty } from '@nestjs/swagger';
export class MedicalAppointment {
  @ApiProperty({
    type: Number,
    description: 'ID of the Doctor',
    example: 1,
    required: true,
  })
  doctorId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the Patient',
    example: 2,
    required: true,
  })
  patientId: number;
  @ApiProperty({
    type: Date,
    description: 'Date of the appointment',
    example: '2024-11-23',
  })
  date_appointment: Date;
  @ApiProperty({
    type: Date,
    description: 'Start time of medical appointment',
    example: '11:00',
  })
  start_time: string;
  @ApiProperty({
    type: String,
    description: 'End time of medical appointment',
    example: '11:30',
  })
  end_time: string;
}
