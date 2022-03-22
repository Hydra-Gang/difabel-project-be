import validate from '../middlewares/validate.middleware';

import { Request, Response } from 'express';
import { Route, Controller } from '../decorators/express.decorator';
import { extractFromHeader } from '../utils/auth.util';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { StatusCodes } from 'http-status-codes';
import { Errors, sendResponse, ApiResponseParams } from '../utils/api.util';
import authenticate from '../middlewares/authenticate.middleware';
import {
    articleIdSchema,
    newArticleSchema,
    NewArticleType
} from '../validations/article.validation';
import { FindManyOptions } from 'typeorm';

const notFoundError: ApiResponseParams<unknown> = {
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Cannot find article'
};

@Route({ path: 'articles' })
export class ArticleRoute {

    @Controller(
        'POST', '/',
        authenticate(), validate(newArticleSchema),
    )
    async postArticle(req: Request, res: Response) {
        const body = req.body as NewArticleType;
        const { id: userId } = extractFromHeader(req)!;

        let user: User | undefined;
        try {
            user = await User.findOne({ where: { id: userId } });

            if (!user) {
                return sendResponse(res, Errors.NO_SESSION_ERROR);
            }
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

    @Controller(
        'DELETE', '/:articleId',
        authenticate(), validate(articleIdSchema, true)
    )
    async deleteArticle(req: Request, res: Response) {
        const payload = extractFromHeader(req)!;
        const { articleId } = req.params;

        try {
            const user = await User.findOne({ where: { id: payload.id } });
            if (!user) {
                return sendResponse(res, Errors.NO_SESSION_ERROR);
            }
            if (!user.hasAnyAccess('EDITOR', 'ADMIN')) {
                return sendResponse(res, Errors.NO_PERMISSION_ERROR);
            }

            const article = await Article.findOne({
                where: { id: parseInt(articleId) }
            });

            if (!article) {
                return sendResponse(res, notFoundError);
            }

            article.isDeleted = true;
            await Article.save(article);

            return sendResponse(res, {
                message: 'Successfully deleted article'
            });
        } catch (err) {
            console.log(err);
            return sendResponse(res, Errors.SERVER_ERROR);
        }

    }

    @Controller('GET', '/:articleId', validate(articleIdSchema, true))
    async getArticle(req: Request, res: Response) {
        const { articleId } = req.params;

        let article: Article | undefined;
        let user: User | undefined;

        try {
            const payload = extractFromHeader(req);
            if (payload) {
                user = await User.findOne({ where: { id: payload.id } });
            }

            article = await Article.findOne({
                where: { id: parseInt(articleId) }
            });

            if (!article) {
                return sendResponse(res, notFoundError);
            }
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }

        const isPermissible = !!user && user.hasAnyAccess('EDITOR', 'ADMIN');
        if (!isPermissible && (!article.isApproved || article.isDeleted)) {
            return sendResponse(res, notFoundError);
        }

        return sendResponse(res, {
            message: 'Article is found',
            data: {
                article: (isPermissible ? article : article.filter())
            }
        });
    }

    @Controller('GET', '/')
    async getAllArticles(req: Request, res: Response) {
        try {
            const payload = extractFromHeader(req);
            let user: User | undefined;
            let output: unknown[];

            if (payload) {
                user = await User.findOne({ where: { id: payload.id } });
            }

            if (user?.hasAnyAccess('EDITOR', 'ADMIN')) {
                output = await Article.find();
            } else {
                const filterOption: FindManyOptions<Article> = {
                    where: {
                        isApproved: true,
                        isDeleted: false
                    }
                };

                const articles = await Article.find(filterOption);
                output = articles.map((article) => article.filter());
            }

            return sendResponse(res, {
                message: 'Found article(s)',
                data: {
                    articles: output
                }
            });
        } catch (err) {
            return sendResponse(res, Errors.SERVER_ERROR);
        }
    }

}