import { Treatment } from '@prisma/client';

export type CreateTreatmentDto = Omit<
  Treatment,
  'id' | 'createdAt' | 'updatedAt'
>;
