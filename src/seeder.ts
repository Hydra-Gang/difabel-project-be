// max-len isn't needed here
/* eslint-disable max-len */

import connectionConfig from './ormconfig';
import bcrypt from 'bcrypt';
import config from './configs/config';

import { User, AccessLevels } from './entities/user.entity';
import { Article, ArticleStatuses } from './entities/article.entity';
import { Report, ReportStatuses } from './entities/report.entity';
import { createConnection } from 'typeorm';

// -------------------------------------------------------------------- //

const DEFAULT_PHONE = '628174991828';

function hashPassword(password: string) {
    return bcrypt.hashSync(password, config.hashRounds);
}

function randomRange(min: number, max: number) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function createData(): [User[], Article[], Report[]] {
    const users: User[] = [
        User.create({
            fullName: 'Mr. Admin',
            email: 'admin@admin.com',
            accessLevel: AccessLevels.ADMIN,
            phone: DEFAULT_PHONE,
            password: hashPassword('Admin123?')
        }),
        User.create({
            fullName: 'Mrs. Editor',
            email: 'editor@editor.com',
            accessLevel: AccessLevels.EDITOR,
            phone: DEFAULT_PHONE,
            password: hashPassword('Editor123?')
        }),
        User.create({
            fullName: 'John Doe',
            email: 'john_doe@example.com',
            phone: DEFAULT_PHONE,
            password: hashPassword('Johndoe123?')
        }),
        User.create({
            fullName: 'Steve Minecraft',
            email: 'steve@minecraft.com',
            phone: DEFAULT_PHONE,
            password: hashPassword('Steve123?')
        }),
        User.create({
            fullName: 'Alex Minecraft',
            email: 'alex@minecraft.com',
            phone: DEFAULT_PHONE,
            password: hashPassword('Alexmc123?')
        })
    ];

    const articles: Article[] = [
        Article.create({
            title: 'Is C programming language the best for beginners?',
            content:
                'Most people think that the C programming language is useless because of how limited it is, but... is it really?\n' +
                '\n' +
                "I don't think so, C is practically the father of all programming languages\n" +
                'and thanks to its simplicity, it has helped many people learn to program',
            status: ArticleStatuses.APPROVED,
        }),
        Article.create({
            title: '10 useful VS code extensions to make life easier -Part- 3',
            content:
                'A soldier loves his weapon more than anything. Developers are soldiers, and an\n' +
                "IDE is a weapon. A soldier's greatest responsibility is always to power up his\n" +
                'weapon and make good use of it.\n' +
                '\n' +
                'VSCode is one of the best weapons out there for a soldier. Here is 10 useful\n' +
                'extension which will make your weapon powerful.',
            status: ArticleStatuses.APPROVED
        }),
        Article.create({
            title: 'Upgrading Next.js for instant performance improvements',
            content:
                "Since the release of Next.js, we've worked to introduce new features and tools that drastically\n" +
                "improve application performance, as well as overall developer experience. Let's take a look at what a\n" +
                'difference upgrading to the latest version of Next.js can make.\n' +
                '\n' +
                'In 2019, our team at Vercel created a serverless demo app called VRS (Virtual Reality Store) using\n' +
                'Next.js 8, Three.js, Express, MongoDB, Mongoose, Passport.js, and Stripe Elements. Users could sign\n' +
                'up, browse multiple 3D models, and purchase them.'
        }),
        Article.create({
            title: "Rust's Unsafe Pointer Types Need An Overhaul",
            content:
                'I think about unsafe pointers in Rust a lot.\n' +
                '\n' +
                "I literally wrote the book on unsafe Rust. And the book on pointers in Rust. And redesigned the Rust's\n" +
                "pointer APIs. And designed the standard library's abstraction for unsafe heap-allocated buffers. And\n" +
                'maintain the alternative Vec layout.'
        })
    ];

    const reports: Report[] = [
        Report.create({
            content: 'My account logs out every 5 minutes'
            // "I can't open the login page, sometimes I can " +
            // 'but I logged out from my account for no reason every 5 minutes'
        }),
        Report.create({
            content: 'Is the homepage is broken when I open it with my iphone 10?'
        }),
        Report.create({
            content: 'A user called Utopia Stranger posted a hoax on the articles',
            // 'A user called Utopia Stranger posted a hoax on the articles, ' +
            // 'I thought it has been verified??? What is wrong with you guys approving his post???? ' +
            // 'That is completely racism!!!',
            status: ReportStatuses.RESOLVED
        })
    ];

    return [users, articles, reports];
}

// -------------------------------------------------------------------- //

createConnection(connectionConfig)
    .then(async () => {
        const [users, articles, reports] = createData();

        const newUsers = await User.save(users);

        for (const article of articles) {
            article.author = newUsers[randomRange(0, articles.length)];
            if (article.status === ArticleStatuses.APPROVED) {
                // permissible users are in idx 0 - 2
                article.approver = newUsers[randomRange(0, 1)];
            }
        }

        for (const report of reports) {
            const admin = newUsers[0];

            if (report.status === ReportStatuses.RESOLVED) {
                report.resolver = admin;
                report.updatedAt = new Date();
            }
        }

        await Article.save(articles);
        await Report.save(reports);

        console.log('Data seeding has finished!');
        process.exit();
    })
    .catch((err) => console.error(err));