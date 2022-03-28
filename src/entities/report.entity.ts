import { User } from './user.entity';

import {
    BaseEntity, Entity,
    Column, JoinColumn, PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';

export enum ReportStatuses {
    PENDING,
    RESOLVED
}

@Entity('reports')
export class Report extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    content!: string;

    @Column({ type: 'smallint', default: ReportStatuses.PENDING })
    status!: ReportStatuses;

    @Column({ name: 'created_at', type: 'date', default: new Date() })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'date', nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'resolver_id' })
    user?: User;

    @Column({ name: 'resolver_id', nullable: true })
    resolverId?: number;

}