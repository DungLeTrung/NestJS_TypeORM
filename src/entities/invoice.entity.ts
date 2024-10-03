import { StatusInvoice } from "src/config/const";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
