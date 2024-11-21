import { Diagnosis } from '@prisma/client';

export type CreateDiagnosisDto = Omit<
  Diagnosis,
  'id' | 'createdAt' | 'updatedAt'
>;
