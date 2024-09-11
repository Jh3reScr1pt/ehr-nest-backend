import { Roles } from '@prisma/client';

export type CreateRoleDto = Omit<Roles, 'id' | 'createdAt' | 'updatedAt'>;
