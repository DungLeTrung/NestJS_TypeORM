import { Request } from 'express';
import { User } from 'src/entities';

export interface CustomRequest extends Request {
  user?: User; 
}