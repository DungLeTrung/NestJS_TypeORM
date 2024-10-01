import { Status } from 'src/config/const';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable({
    name: 'orders_products',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @Column('json', { nullable: true })
  productQuantities: { productId: string; quantity: number }[] | null;

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
