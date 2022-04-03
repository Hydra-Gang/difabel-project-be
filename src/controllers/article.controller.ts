import validate from '../middlewares/validate.middleware';
import authenticate from '../middlewares/authenticate.middleware';

import { Request, Response, urlencoded } from 'express';
import { Route, Controller } from '../decorators/express.decorator';
import { getPayloadFromHeader } from '../utils/auth.util';
import { User } from '../entities/user.entity';
import { Article, ArticleStatuses } from '../entities/article.entity';
import { StatusCodes } from 'http-status-codes';
import { Errors, ResponseError, sendResponse } from '../utils/api.util';
import { FindOneOptions } from 'typeorm';
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

    @Controller('POST', '/add', authenticate(), validate(newArticleSchema))
    async postArticle(req: Request, res: Response) {
        const body = req.body as NewArticleType;
        const payload = getPayloadFromHeader(req)!;

        const user = await User.findOne({ where: { id: payload.id } });
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
        'DELETE', '/delete/:articleId',
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

    @Controller('PUT', '/status/:articleId', authenticate())
    async changeArticleStatus(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const user = await User.findOne({ where: { id: payload.id } });
        const { articleId } = req.params;

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

    @Controller(
        'GET', '/filter',
        authenticate(), urlencoded({ extended: true })
    )
    async getArticlesFiltered(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req)!;
        const status = req.query.status as string;
        const user = await User.findOne({ where: { id: payload.id } });

        if (!user) {
            throw Errors.NO_SESSION;
        }
        if (!user.hasAnyAccess('EDITOR', 'ADMIN')) {
            throw Errors.NO_PERMISSION;
        }

        const articles = await Article.find({
            where: { status: parseInt(status) },
            relations: ['author', 'approver']
        });

        const output = articles.map((article) => article.filter(true));
        return sendResponse(res, {
            message: 'Found article(s)',
            data: { articles: output }
        });
    }

    @Controller('GET', '/')
    async getAllArticles(req: Request, res: Response) {
        const payload = getPayloadFromHeader(req);
        let user: User | undefined;

        if (payload) {
            user = await User.findOne({ where: { id: payload.id } });
        }

        const hasPermission = !!user?.hasAnyAccess('EDITOR', 'ADMIN');
        const defaultOption: FindOneOptions<Article> = {
            relations: ['author', 'approver']
        };

        if (!hasPermission) {
            defaultOption.where = {
                status: ArticleStatuses.APPROVED,
                isDeleted: false
            };
        }

        const articles = await Article.find(defaultOption);
        const output = articles.map((article) => article.filter(hasPermission));

        return sendResponse(res, {
            message: 'Found article(s)',
            data: { articles: output }
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
            where: { id: parseInt(articleId) },
            relations: ['author', 'approver']
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

        const output = article.filter(hasPermission);
        return sendResponse(res, {
            message: 'Article is found',
            data: {
                article: output
            }
        });
    }

}