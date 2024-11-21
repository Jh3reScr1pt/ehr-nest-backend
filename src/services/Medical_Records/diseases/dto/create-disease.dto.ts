import { Disease } from '@prisma/client';

export type CreateDiseaseDto = Omit<Disease, 'id' | 'createdAt' | 'updatedAt'>;
