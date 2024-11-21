import { MedicalRecord } from '@prisma/client';

export type CreateMedicalRecordDto = Omit<
  MedicalRecord,
  'id' | 'createdAt' | 'updatedAt'
>;
