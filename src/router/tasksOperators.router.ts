import { Router } from 'express';
import { createTaskOperator, updateTaskOperatorState } from '../handlers/tasksOperators';
import { validateSchema } from '../middlewares/validator.middleware';
import { tasksOperatorsSchema } from '../schemas/tasksOperators.schema';

const routerTasksOperators = Router();

// Crear asignación tarea-operador
routerTasksOperators.post('/', validateSchema(tasksOperatorsSchema), createTaskOperator);
// Actualizar estado de la tarea-operador
routerTasksOperators.put('/:ID_task/:ID_user', validateSchema(tasksOperatorsSchema), updateTaskOperatorState);

export default routerTasksOperators;
