import validate from '../middlewares/validate.middleware';
import authenticate from '../middlewares/authenticate.middleware';

import { Request, Response, urlencoded } from 'express';
import { Route, Controller } from '../decorators/express.decorator';
import { getPayloadFromHeader } from '../utils/auth.util';
import { User } from '../entities/user.entity';
import { Article, ArticleStatuses } from '../entities/article.entity';
import { StatusCodes } from 'http-status-codes';
import { Errors, ResponseError, sendResponse } from '../utils/api.util';
import { FindManyOptions } from 'typeorm';
import {
    articleIdSchema,
    newArticleSchema,
    NewArticleType
} from '../validations/article.validation';

const ARTICLE_NOT_FOUND = new ResponseError(
    'Cannot find article',
    StatusCodes.NOT_FOUND);

@Route({ path: 'articles' })
export class ArticleRoute {

    @Controller('POST', '/', authenticate(), validate(newArticleSchema))
    async postArticle(req: Request, res: Response) {
        const body = req.body as NewArticleType;
        const { id: userId } = getPayloadFromHeader(req)!;

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw Errors.NO_SESSION;
        }

        const article = Article.create({ author: user, ...body });
        await Article.save(article);

        return sendResponse(res, {
            message: 'Successfully created new article',
            data: { articleId: article.id }
        });
    }

    @Controller(
        'DELETE', '/:articleId',
        authenticate(), validate(articleIdSchema, true)
    )
    async deleteArticle(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const { articleId } = req.params;

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('EDITOR', 'ADMIN')) {
            throw Errors.NO_PERMISSION;
        }

        const article = await Article.findOne({
            where: { id: parseInt(articleId) }
        });

        if (!article) {
            throw ARTICLE_NOT_FOUND;
        }

        article.isDeleted = true;
        await Article.save(article);

        return sendResponse(res, { message: 'Successfully deleted article' });
    }

    @Controller('GET', '/', authenticate(), urlencoded({ extended: true }))
    async getArticlesByStatus(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const status = req.query.status as string;

        const user = await User.findOne({ where: { id: payload.id } });

        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('EDITOR')) {
            throw Errors.NO_PERMISSION;
        }

        const articles = await Article.find({
            where: { status: parseInt(status) }
        });

        return sendResponse(res, {
            message: 'Found article(s)',
            data: { articles }
        });
    }

    @Controller('GET', '/:articleId', validate(articleIdSchema, true))
    async getArticle(req: Request, res: Response) {
        const { articleId } = req.params;

        let user: User | undefined;
        const payload = getPayloadFromHeader(req);

        if (payload) {
            user = await User.findOne({ where: { id: payload.id } });
        }

        const article = await Article.findOne({
            where: { id: parseInt(articleId) }
        });

        if (!article) {
            throw ARTICLE_NOT_FOUND;
        }

        const hasPermission = !!user && user.hasAnyAccess('EDITOR', 'ADMIN');
        const isNotForGuest =
            article.status === ArticleStatuses.PENDING ||
            article.isDeleted;

        if (!hasPermission && isNotForGuest) {
            throw ARTICLE_NOT_FOUND;
        }

        return sendResponse(res, {
            message: 'Article is found',
            data: {
                article: (hasPermission ? article : article.filter())
            }
        });
    }

    @Controller('GET', '/')
    async getAllArticles(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req);
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
                    status: ArticleStatuses.APPROVED,
                    isDeleted: false
                }
            };

            const articles = await Article.find(filterOption);
            output = articles.map((article) => article.filter());
        }

        return sendResponse(res, {
            message: 'Found article(s)',
            data: { articles: output }
        });
    }

    @Controller('PUT', '/:articleId', authenticate())
    async changeArticleStatus(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const { articleId } = req.params;

        const user = await User.findOne({ where: { id: payload.id } });

        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('EDITOR')) {
            throw Errors.NO_PERMISSION;
        }

        const article = await Article.findOne({
            where: { id: parseInt(articleId) }
        });

        if (!article) {
            throw ARTICLE_NOT_FOUND;
        }

        const isPending = article.status === ArticleStatuses.PENDING;
        if (isPending) {
            article.status = ArticleStatuses.APPROVED;
        } else {
            article.status = ArticleStatuses.PENDING;
        }

        await Article.save(article);
        return sendResponse(res, {
            message: 'Succesfully change article status'
        });
    }

}