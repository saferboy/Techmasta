import { Roles, ROLES } from './role.decorator';
import { applyDecorators, SetMetadata } from '@nestjs/common';

interface ProtectRouteOption {
  isPublic?: boolean;
  roles?: ROLES[];
}

export const ProtectedRoute = ({ isPublic = false, roles = [] }: ProtectRouteOption) => {
  const decorators = [];

  if (isPublic) {
    decorators.push(Roles());
    decorators.push(SetMetadata('IS_PUBLIC', true));
  } else {
    decorators.push(SetMetadata('IS_PUBLIC', false));

    if (roles.length) {
      decorators.push(Roles(...roles));
    }
  }

  return applyDecorators(...decorators);
};
