import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'products_categories', 
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id', 
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToMany(() => Order, (order) => order.products) // Many products can be in many orders
  orders: Order[];
}
