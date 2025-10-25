import { Request, Response } from 'express';
import TasksOperators from '../models/Tasks_operators.models';
import Task from '../models/Task.models';
import GeneralTask from '../models/General_tasks.models';
import OperatorTaskState from '../models/Operator_task_states.models';
import User from '../models/Users.models';
import { fn, col } from 'sequelize';

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
    const task = await Task.findByPk(ID_task);
    if (task) {
      const generalTaskId = task.ID_general_tasks;
      const allTasks = await Task.findAll({ where: { ID_general_tasks: generalTaskId } });
      const allTaskIds = allTasks.map(t => t.ID_task);
      const allTaskOperators = await TasksOperators.findAll({ where: { ID_task: allTaskIds } });
      const { Op } = require('sequelize');
      const completedState = await OperatorTaskState.findOne({ where: { name: { [Op.iLike]: 'completado' } } });
      if (completedState) {
        const allCompleted = allTaskOperators.every(to => to.ID_operator_task_states === completedState.ID_operator_task_states);
        if (allCompleted && allTasks.length > 0) {
          await GeneralTask.update({ state: completedState.name }, { where: { ID_general_tasks: generalTaskId } });
        }
      }
    }

    res.status(200).json({ data: taskOperator });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado.' });
  }
};

const getOperatorsWorkload = async (req: Request, res: Response) => {
    try {
      const workload = await TasksOperators.findAll({
        attributes: [
          [fn('COUNT', col('ID_task')), 'taskCount']
        ],
        include: [{
          model: User,
          attributes: ['ID_users', 'name', 'last_name'],
        }],
        group: [
          'user.ID_users',
          'user.name',
          'user.last_name'
        ],
        order: [[fn('COUNT', col('ID_task')), 'DESC']],
        raw: true,
        nest: true
      });
  
      const formattedWorkload = workload.map((item: any) => ({
          userId: item.user.ID_users,
          name: item.user.name,
          lastName: item.user.last_name,
          taskCount: parseInt(item.taskCount, 10)
      }));
  
      res.status(200).json(formattedWorkload);
    } catch (error) {
      console.error("Error fetching operators workload:", error);
      res.status(500).json({ error: 'Error al obtener la carga de trabajo de los operadores.' });
    }
  };

export { createTaskOperator, updateTaskOperatorState, getOperatorsWorkload };