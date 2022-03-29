import { User } from './user.entity';
import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn, JoinColumn,
    ManyToOne
} from 'typeorm';

export enum ArticleStatuses {
    PENDING,
    APPROVED
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

    @Column({ name: 'updated_at', type: 'date', nullable: true })
    updatedAt?: Date;

    @Column({ type: 'smallint', default: ArticleStatuses.PENDING })
    status!: ArticleStatuses;

    @Column({ name: 'is_deleted', default: false })
    isDeleted!: boolean;

    @ManyToOne(() => User, (user) => user.articles)
    @JoinColumn({ name: 'author_id' })
    author!: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'approver_id' })
    approver?: User;

    /**
     * Gets the filtered version of the object.
     * We need to limit the information sent to the users.
     *
     * @param isEditor If it's for an admin, it'll show more information.
     */
    filter(isEditor: boolean) {
        const { approver, author } = this;
        const cloned = { ...this } as Record<string, unknown>;

        cloned.author = author.filter(false);
        if (approver) {
            cloned.approver = approver.filter(false);
        }

        if (!isEditor) {
            delete cloned.status;
            delete cloned.isDeleted;
        }

        return cloned;
    }

}