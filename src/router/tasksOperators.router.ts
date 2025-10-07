import { Router } from 'express';
import { createTaskOperator, updateTaskOperatorState } from '../handlers/tasksOperators';

const routerTasksOperators = Router();

// Crear asignación tarea-operador
routerTasksOperators.post('/', createTaskOperator);
// Actualizar estado de la tarea-operador
routerTasksOperators.put('/:ID_task/:ID_user', updateTaskOperatorState);

export default routerTasksOperators;
