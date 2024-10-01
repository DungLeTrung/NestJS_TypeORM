import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
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

  @Column('json')
  productQuantities: { productId: string; quantity: number }[];

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.orders) 
  user: User; 

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

}
