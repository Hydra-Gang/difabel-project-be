import { User } from './user.entity';
import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn, JoinColumn,
    ManyToOne
} from 'typeorm';

export enum ArticleStatus {
    APPROVED,
    PENDING,
    DELETED
}

@Entity('articles')
export class Article extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 128 })
    title!: string;

    @Column({ length: 2_000 })
    content!: string;

    @Column({ name: 'created_at', type: 'date', default: new Date() })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'date', default: new Date() })
    updatedAt!: Date;

    @Column({ name: 'is_deleted', default: false })
    isDeleted!: boolean;

    @Column({ name: 'is_approved', default: false })
    isApproved!: boolean;

    @ManyToOne(() => User, (user) => user.articles)
    @JoinColumn({ name: 'author_id' })
    author!: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'approver_id' })
    approver!: User;

    /**
     * Gets the filtered version of the object
     *
     * NOTE: The object will lose it's reference.
     */
    filter() {
        const cloned = { ...this } as Record<string, unknown>;

        delete cloned.isDeleted;
        delete cloned.isApproved;

        return cloned;
    }

}