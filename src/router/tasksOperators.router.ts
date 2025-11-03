import { Router } from 'express';
import { createTaskOperator, updateTaskOperatorState, getOperatorsWorkload, getTasksByOperatorId } from '../handlers/tasksOperators';
import { validateSchema } from '../middlewares/validator.middleware';
import { tasksOperatorsSchema, updateTasksOperatorsSchema } from '../schemas/tasksOperators.schema';
import { authRequierd } from '../middlewares/validateToken';

const routerTasksOperators = Router();

// Ruta para obtener la carga de trabajo de los operadores
routerTasksOperators.get('/workload', 
    //authRequierd, 
    getOperatorsWorkload);

// Ruta para obtener las tareas por id de operador
routerTasksOperators.get('/operator/:id', 
    //authRequierd, 
    getTasksByOperatorId);

// Crear asignación tarea-operador
routerTasksOperators.post('/', validateSchema(tasksOperatorsSchema), createTaskOperator);
// Actualizar estado de la tarea-operador
routerTasksOperators.put('/:ID_task/:ID_user', 
    //validateSchema(updateTasksOperatorsSchema), 
    updateTaskOperatorState);

export default routerTasksOperators;