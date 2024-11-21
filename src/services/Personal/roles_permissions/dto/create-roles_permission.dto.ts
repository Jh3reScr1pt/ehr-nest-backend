import { RolesPermissions } from '@prisma/client';

export type CreateRolesPermissionsDto = Omit<RolesPermissions, 'assignedAt'>;
