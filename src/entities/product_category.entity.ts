import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Product } from './product.entity';
  import { Category } from './category.entity';
  
  @Entity('products_categories')
  export class ProductCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Product, (product) => product.productCategories, {
      nullable: false,
    })
    product: Product;
  
    @ManyToOne(() => Category, (category) => category.productCategories, {
      nullable: false,
    })
    category: Category;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  