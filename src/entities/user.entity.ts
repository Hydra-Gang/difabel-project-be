import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn
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

    @Column({ name: 'access_level', type: 'smallint' })
    accessLevel!: AccessLevels;

}