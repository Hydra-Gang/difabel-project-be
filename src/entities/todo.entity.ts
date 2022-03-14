import { DateTime } from 'luxon';
import {
    BaseEntity, Entity,
    Column, PrimaryGeneratedColumn,
    ValueTransformer
} from 'typeorm';

/**
 * Since the database can only accept {@link Date}
 * we have to make it transform from {@link DateTime} to {@link Date}
 *
 * Well, I want to use {@link DateTime} from luxon
 * so that I can easily format it using {@link Todo.DATE_FORMAT}
 */
const dateTransformer: ValueTransformer = {
    from: (date: Date) => DateTime.fromJSDate(date),
    to: (date: DateTime) => date.toJSDate()
};

@Entity({ name: 'todos' })
export default class Todo extends BaseEntity {

    static readonly DATE_FORMAT = 'dd-MM-yyyy HH:mm:ss';

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 256 })
    message!: string;

    @Column({
        type: 'timestamp',
        transformer: dateTransformer
    })
    createdAt!: DateTime;

    /**
     * Used for the response output
     *
     * I want the {@link createdAt} to output a formatted email
     * based on {@link DATE_FORMAT}
     */
    toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            message: this.message,
            createdAt: this.createdAt.toFormat(Todo.DATE_FORMAT)
        };
    }

}