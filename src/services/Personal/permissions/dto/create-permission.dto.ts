import { Permissions } from '@prisma/client';

export type CreatePermissionDto = Omit<
  Permissions,
  'id' | 'createdAt' | 'updatedAt'
>;
