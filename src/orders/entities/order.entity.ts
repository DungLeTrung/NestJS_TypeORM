import { Status } from "src/config/const";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('orders') 
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @ManyToOne(() => User, (user) => user.orders)  
    @JoinColumn({ name: 'user_id' }) 
    user: User;  

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;  

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;  

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING,
    })
    status: Status;  
}
