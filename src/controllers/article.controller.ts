import validate from '../middlewares/validate.middleware';
import authenticate, {
    extractBearerToken
} from '../middlewares/authenticate.middleware';

import { Request, Response } from 'express';
import { Route, Controller } from '../decorators/express.decorator';
import { UserLike } from '../utils/user.util';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { StatusCodes } from 'http-status-codes';
import { Errors, sendResponse, ApiResponseParams } from '../utils/api.util';
import { FindManyOptions } from 'typeorm';
import {
    articleIdSchema,
    newArticleSchema,
    NewArticleType
} from '../validations/article.validation';


const notFoundError: ApiResponseParams<unknown> = {
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Cannot find article'
};

@Route({ path: 'articles' })
export class ArticleRoute {

    @Controller(
        'POST', '/',
        validate(newArticleSchema),
        authenticate
    )
    async postArticle(req: Request, res: Response) {
        const { id: userId } = req.body.$auth as UserLike;
        // TODO: change $auth to a function that load the token?
        delete req.body.$auth;

        const body = req.body as NewArticleType;

        let user: User;
        try {
            user = await User.findOne({ where: { id: userId } }) as User;
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }

        const article = Article.create({
            author: user,
            ...body
        });

        try {
            await Article.save(article);

            return sendResponse(res, {
                message: 'Successfully created new article',
                data: {
                    articleId: article.id
                }
            });
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }
    }

    @Controller('GET', '/:articleId', validate(articleIdSchema, true))
    async getArticle(req: Request, res: Response) {
        const { articleId } = req.params;

        let article: Article | undefined;
        try {
            article = await Article.findOne({
                where: {
                    id: parseInt(articleId)
                }
            });

            if (!article) {
                return sendResponse(res, notFoundError);
            }
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }

        // TODO: allow editors to view the article
        if (!article.isApproved) {
            return sendResponse(res, notFoundError);
        }

        return sendResponse(res, {
            message: 'Article is found',
            data: {
                article: article.filter()
            }
        });
    }

    @Controller('GET', '/')
    async getAllArticles(req: Request, res: Response) {
        const rawToken = req.header('authorization');
        const token = extractBearerToken(rawToken);

        try {
            let articles: unknown[];
            const findApproved: FindManyOptions<Article> = {
                where: { isApproved: true }
            };

            // TODO: specifically check for the permission
            if (!token) {
                const rawArticles = await Article.find(findApproved);
                articles = rawArticles.map((article) => article.filter());
            } else {
                articles = await Article.find();
            }

            return sendResponse(res, {
                message: 'Found article(s)',
                data: { articles }
            });
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }
    }

}