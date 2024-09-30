import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/config/const';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);