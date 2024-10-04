import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString({ each: true }) 
  userId: string;
  
  @IsNotEmpty()
  @IsString()
  dueDate: string; 
}
