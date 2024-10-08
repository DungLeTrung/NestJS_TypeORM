import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;


  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
