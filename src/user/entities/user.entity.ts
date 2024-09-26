import { Role } from "src/config/const";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users') 
export class User {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column({ unique: true })
    username: string; 

    @Column()
    password: string;  

    @Column({ unique: true })
    email: string;  

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;  

    @Column({ default: true })
    isActive: boolean;  

    @OneToMany(() => Order, (order) => order.user) 
    orders: Order[];
}
