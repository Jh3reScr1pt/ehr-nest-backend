import { MedicalAppointment } from '@prisma/client';

export type CreateMedicalAppointmentDto = Omit<
  MedicalAppointment,
  'id' | 'createdAt' | 'updatedAt'
>;
