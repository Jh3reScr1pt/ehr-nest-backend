import { Specialties } from '@prisma/client';

export type CreateSpecialtyDto = Omit<
  Specialties,
  'id' | 'createdAt' | 'updatedAt'
>;
