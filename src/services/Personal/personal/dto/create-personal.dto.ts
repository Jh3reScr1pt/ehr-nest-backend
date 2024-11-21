import { Personal } from '@prisma/client';

export type CreatePersonalDto = Omit<
  Personal,
  'id' | 'createdAt' | 'updatedAt'
>;
