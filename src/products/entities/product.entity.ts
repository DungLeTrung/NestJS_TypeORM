import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products') 
export class Product {
    @PrimaryGeneratedColumn()
    id: number;  

    @Column({ length: 255 })
    name: string;  

    @Column('text', { nullable: true })
    description: string;  

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;  

    @Column('int')
    stock: number;  
}
