import { Router } from 'express';
import { createTaskOperator, updateTaskOperatorState, getOperatorsWorkload } from '../handlers/tasksOperators';
import { validateSchema } from '../middlewares/validator.middleware';
import { tasksOperatorsSchema } from '../schemas/tasksOperators.schema';
import { authRequierd } from '../middlewares/validateToken';

const routerTasksOperators = Router();

// Ruta para obtener la carga de trabajo de los operadores
routerTasksOperators.get('/workload', 
    //authRequierd, 
    getOperatorsWorkload);

// Crear asignación tarea-operador
routerTasksOperators.post('/', validateSchema(tasksOperatorsSchema), createTaskOperator);
// Actualizar estado de la tarea-operador
routerTasksOperators.put('/:ID_task/:ID_user', validateSchema(tasksOperatorsSchema), updateTaskOperatorState);

export default routerTasksOperators;
