import { DiseaseGroup } from '@prisma/client';

export type CreateDiseasesGroupDto = Omit<
  DiseaseGroup,
  'id' | 'createdAt' | 'updatedAt'
>;
