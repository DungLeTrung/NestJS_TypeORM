import { IsString, IsNotEmpty } from 'class-validator';

export class SampleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
