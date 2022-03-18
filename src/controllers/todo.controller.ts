import { Request, Response } from 'express';
import { sendResponse } from '../utils/api.util';
import { DateTime } from 'luxon';
import { StatusCodes } from 'http-status-codes';
import { Controller, Route } from '../decorators/express.decorator';
import { newTodoSchema, todoIdSchema } from '../validations/todo.validation';

import Todo from '../entities/todo.entity';
import validate from '../middlewares/validate.middleware';

@Route({ path: 'todos' })
export class TodoRoute {

    @Controller('POST', '/add', validate(newTodoSchema))
    async addTodo(req: Request, res: Response) {
        const { body } = req;

        const todo = Todo.create({
            message: body.message,
            createdAt: DateTime.utc()
        });

        try {
            await Todo.save(todo);

            return sendResponse(res, {
                message: 'Successfully added new todo!'
            });
        } catch (err) {
            console.error(err);

            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'An error occurred when adding todo'
            });
        }
    }

    @Controller('GET', '/')
    async getAllTodo(_: Request, res: Response) {
        try {
            const todoList = await Todo.find();

            return sendResponse(res, {
                message: 'Successfully get all todo list',
                data: {
                    todos: todoList.map((todo) => todo.toJSON())
                }
            });
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Unexpected server error'
            });
        }
    }

    @Controller('DELETE', '/:todoId/', validate(todoIdSchema, true))
    async removeTodo(req: Request, res: Response) {
        const { todoId } = req.params;

        try {
            await Todo.delete(parseInt(todoId));
            return sendResponse(res, {
                message: 'Successfully deleted todo'
            });
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Unexpected server error'
            });
        }
    }

}