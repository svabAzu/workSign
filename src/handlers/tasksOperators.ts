import { Request, Response } from 'express';
import TasksOperators from '../models/Tasks_operators.models';
import Task from '../models/Task.models';
import GeneralTask from '../models/General_tasks.models';
import OperatorTaskState from '../models/Operator_task_states.models';
import User from '../models/Users.models';
import { fn, col } from 'sequelize';
import Material from '../models/Materials.models';
import MaterialsTasks from '../models/Materials_tasks.models';
import Client from '../models/Client.models';

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
          col('user.ID_users'),
          col('user.name'),
          col('user.last_name')
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

  const getTasksByOperatorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      //console.log(`Buscando tareas para el operador con ID: ${id}`);
  
      // 1. Encontrar todas las tareas asignadas al operador
      const operatorTasks = await TasksOperators.findAll({
        where: { ID_user: id },
        attributes: ['ID_task'],
        raw: true
      });

      //console.log('Resultado de TasksOperators.findAll:', operatorTasks);
  
      if (!operatorTasks || operatorTasks.length === 0) {
        console.log('No se encontraron tareas asignadas para este operador.');
        return res.status(200).json([]); // No hay tareas para este operador
      }
  
      // 2. Extraer los IDs de las tareas
      const taskIds = operatorTasks.map(opTask => opTask.ID_task);
      console.log('IDs de tareas encontrados:', taskIds);
  
      // 3. Buscar todas las tareas con esos IDs y cargar las relaciones
      const tasks = await Task.findAll({
        where: {
          ID_task: taskIds
        },
        include: [
          {
            model: GeneralTask,
            as: 'generalTask',
            include: [
              {
                model: Client,
                as: 'client'
              }
            ]
          },
          {
            model: TasksOperators,
            as: 'taskOperators',
            include: [
              {
                model: User,
                as: 'user',
              },
              {
                model: OperatorTaskState,
              }
            ]
          },
          {
            model: MaterialsTasks,
            as: 'materialsTasks',
            include: [
              {
                model: Material,
                as: 'material',
              }
            ]
          },
        ]
      });
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks by operator id:", error);
      res.status(500).json({ error: 'Error al obtener las tareas del operador.' });
    }
  };
  
export { createTaskOperator, updateTaskOperatorState, getOperatorsWorkload, getTasksByOperatorId };