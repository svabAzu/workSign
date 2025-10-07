import { Request, Response } from 'express';
import TasksOperators from '../models/Tasks_operators.models';
import Task from '../models/Task.models';
import GeneralTask from '../models/General_tasks.models';
import OperatorTaskState from '../models/Operator_task_states.models';

// Crear una asignación tarea-operador
const createTaskOperator = async (req: Request, res: Response) => {
  try {
    const newTaskOperator = await TasksOperators.create(req.body);
    res.status(201).json({ data: newTaskOperator });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la asignación.' });
  }
};

// Actualizar el estado de una tarea-operador
const updateTaskOperatorState = async (req: Request, res: Response) => {
  try {
    const { ID_task, ID_user } = req.params;
    const { ID_operator_task_states } = req.body;
    const taskOperator = await TasksOperators.findOne({ where: { ID_task, ID_user } });
    if (!taskOperator) {
      return res.status(404).json({ error: 'Asignación no encontrada.' });
    }
    await taskOperator.update({ ID_operator_task_states });

    // Lógica: Si todas las tareas individuales de la GeneralTask están completadas, marcar la GeneralTask como completada
    // 1. Buscar la tarea para obtener su GeneralTask
    const task = await Task.findByPk(ID_task);
    if (task) {
      const generalTaskId = task.ID_general_tasks;
      // 2. Buscar todas las tasks de esa GeneralTask
      const allTasks = await Task.findAll({ where: { ID_general_tasks: generalTaskId } });
      const allTaskIds = allTasks.map(t => t.ID_task);
      // 3. Buscar todos los tasks_operators de esas tasks
      const allTaskOperators = await TasksOperators.findAll({ where: { ID_task: allTaskIds } });
  // 4. Buscar el estado "Completado" de forma insensible a mayúsculas en OperatorTaskState
  // Si en el futuro cambia el valor, ajusta aquí:
  const { Op } = require('sequelize');
  const completedState = await OperatorTaskState.findOne({ where: { name: { [Op.iLike]: 'completado' } } });
      if (completedState) {
        const allCompleted = allTaskOperators.every(to => to.ID_operator_task_states === completedState.ID_operator_task_states);
        if (allCompleted && allTasks.length > 0) {
          // 5. Marcar la GeneralTask como completada usando el mismo case que el estado encontrado
          await GeneralTask.update({ state: completedState.name }, { where: { ID_general_tasks: generalTaskId } });
        }
      }
    }

    res.status(200).json({ data: taskOperator });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado.' });
  }
};

export { createTaskOperator, updateTaskOperatorState };
