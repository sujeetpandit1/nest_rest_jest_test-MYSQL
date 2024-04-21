
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    firstName: string;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    lastName?: string;

    @Column({ type: 'varchar', unique: true, length: 100 })
    email: string;

    @Column('text')
    password: string;

    @Column({ type: 'enum', enum: ['admin', 'user', 'other'], default: 'user' })
    role: string;

    @Column({ type: 'varchar', length: 10, unique: true})
    mobile_no: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

