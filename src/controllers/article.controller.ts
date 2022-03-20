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
import {
    articleIdSchema,
    newArticleSchema,
    NewArticleType
} from '../validations/article.validation';

@Route({ path: 'articles' })
export class ArticleRoute {

    @Controller(
        'POST',
        '/post',
        authenticate,
        validate(newArticleSchema)
    )
    async postArticle(req: Request, res: Response) {
        const { id: userId } = req.body.$auth as UserLike;
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

        const notFoundError: ApiResponseParams<unknown> = {
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Cannot find article'
        };

        let article: Article | undefined;
        try {
            article = await Article.findOne({
                where: {
                    id: parseInt(articleId)
                }
            });

            if (!article) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: 'Cannot find article'
                });
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

        if (!token) {
            // TODO: give all approved articles
        } else {
            // TODO: give all articles
        }
    }

}