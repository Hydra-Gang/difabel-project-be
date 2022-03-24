import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('locations')
export class Location extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 30 })
    type!: string;

    @Column({ length: 300 })
    address!: string;

    @Column({ type: 'double' })
    latitude!: number;

    @Column({ type: 'double' })
    longitude!: number;

    @Column({ name: 'created_at', type: 'date', default: new Date() })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'date', nullable: true })
    updatedAt?: Date;

}