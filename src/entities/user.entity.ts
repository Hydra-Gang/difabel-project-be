import { Article } from './article.entity';
import { Report } from './report.entity';
import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

type AccessLevelType = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';

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

    @OneToMany(() => Article, (article) => article.author)
    articles!: Article[];

    /**
     * The reports resolved by current user
     */
    @OneToMany(() => Report, (report) => report.resolver)
    resolvedReports!: Report[];

    /**
     * The articles approved by current user
     */
    @OneToMany(() => Article, (article) => article.approver)
    approvedArticles!: Article[];

    /**
     * Checks if user has access
     *
     * It can check multiple values like the OR operator.
     * This is meant to save some lines in your code.
     *
     * Ex: Does A have 'CONTRIBUTOR' or 'EDITOR' access?
     */
    hasAnyAccess(...accessList: AccessLevelType[]): boolean {
        for (const access of accessList) {
            const currentAccess = AccessLevels[access];

            if (typeof currentAccess !== 'number') {
                throw Error("Access level isn't defined");
            }

            if (currentAccess === this.accessLevel) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the filtered version of the object.
     * We need to limit the information sent to the users.
     *
     * @param isAdmin If it's for an admin, it'll show more information.
     */
    filter(isAdmin: boolean) {
        const cloned = { ...this } as Record<string, unknown>;

        delete cloned.password;
        if (!isAdmin) {
            delete cloned.phone;
            delete cloned.accessLevel;
        }

        return cloned;
    }

}