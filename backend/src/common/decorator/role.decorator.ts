import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';
export type ROLES = 'SUPERADMIN' | 'ADMIN' | 'USER' | 'MANAGER' | ' SUPPORT';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);
