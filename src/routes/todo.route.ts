import { Router } from 'express';
import { newTodoSchema, todoIdSchema } from '../validations/todo.validation';

import controller from '../controllers/todo.controller';
import validateHandler from '../middlewares/validate.middleware';

const router = Router();

router.get('/', controller.getAllTodo);
router.post('/add',
    validateHandler(newTodoSchema),
    controller.addTodo
);
router.delete('/:todoId',
    validateHandler(todoIdSchema, true),
    controller.removeTodo
);

export default router;