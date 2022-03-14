import { Request, Response } from 'express';
import { sendResponse } from '../utils/api.util';
import { DateTime } from 'luxon';
import { StatusCodes } from 'http-status-codes';

import Todo from '../entities/todo.entity';

async function addTodo(req: Request, res: Response) {
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

async function getAllTodo(_: Request, res: Response) {
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

async function removeTodo(req: Request, res: Response) {
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

export default { addTodo, getAllTodo, removeTodo };