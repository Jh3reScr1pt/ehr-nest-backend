import { Patients } from '@prisma/client';

export type CreatePatientDto = Omit<Patients, 'id' | 'createdAt' | 'updatedAt'>;
