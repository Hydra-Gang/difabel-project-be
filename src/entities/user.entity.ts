import { Article } from './article.entity';
import { Report } from './report.entity';
import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

/**
 * Describes the user's current role
 */
export enum AccessLevels {
    ADMIN,
    EDITOR,
    CONTRIBUTOR
}

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'full_name', length: 64 })
    fullName!: string;

    @Column({ length: 64 })
    email!: string;

    @Column({ length: 32 })
    phone!: string;

    @Column({ length: 64 })
    password!: string;

    @Column({
        name: 'access_level',
        type: 'smallint',
        default: AccessLevels.CONTRIBUTOR
    })
    accessLevel!: AccessLevels;

    @OneToMany(() => Report, (report) => report.user)
    reports!: Report[];

    @OneToMany(() => Article, (article) => article.author)
    articles!: Article[];

    /**
     * The articles approved by current user
     */
    @OneToMany(() => Article, (article) => article.approver)
    approvedArticles!: Article[];

}