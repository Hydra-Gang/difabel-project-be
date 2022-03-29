import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('donations')
export class Donation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    donator!: string;

    @Column({ type: 'bigint' })
    money!: number;

    @Column({ name: 'donated_at', type: 'date', default: new Date() })
    donatedAt!: Date;

}