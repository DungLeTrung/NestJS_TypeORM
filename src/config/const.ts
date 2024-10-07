import { IUser } from 'src/module/user/interfaces/user.interface';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum StatusInvoice {
  NEW = 'NEW',
  OVERDUE = 'OVERDUE',
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

export function extractNameFromContent(content: string): string | null {
  const lines = content.split('\n'); // Tách từng dòng
  for (const line of lines) {
    const [key, value] = line.split(':'); // Tách theo dấu :
    if (key.trim() === 'name') {
      return value.trim(); // Trả về giá trị name
    }
  }
  return null; // Nếu không tìm thấy name
}

