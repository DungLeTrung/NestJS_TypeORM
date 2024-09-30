import { IUser } from 'src/user/interfaces/user.interface';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}

export interface RegisterResponse {
  message: string;
  user: IUser;
}

export function transformSort(sort: any): Record<string, 'ASC' | 'DESC'> {
  const sortKeys = Object.keys(sort);
  const sortObj: Record<string, 'ASC' | 'DESC'> = {};
  sortKeys.forEach((key) => {
    sortObj[key] = sort[key] === 'desc' ? 'DESC' : 'ASC';
  });
  return sortObj;
}
