import { StatusInvoice } from "src/config/const";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: StatusInvoice,
    default: StatusInvoice.NEW,
  })
  status: StatusInvoice;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' }) 
  user: User;
}
