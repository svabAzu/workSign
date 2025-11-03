import { Request, Response } from 'express';
import TasksOperators from '../models/Tasks_operators.models';
import Task from '../models/Task.models';
import GeneralTask from '../models/General_tasks.models';
import OperatorTaskState from '../models/Operator_task_states.models';
import GeneralTaskState from '../models/General_task_states.models';
import User from '../models/Users.models';
import { fn, col } from 'sequelize';
import Material from '../models/Materials.models';
import MaterialsTasks from '../models/Materials_tasks.models';
import Client from '../models/Client.models';
const { Op } = require('sequelize');
import sequelize from '../config/db';

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
  console.log('--- Starting updateTaskOperatorState ---');
  try {
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    const { ID_task, ID_user } = req.params;
    const { ID_operator_task_states } = req.body;

  // Iniciar una transacción para mayor seguridad (atomicidad)
  let taskOperator: any = null;
  const t = await sequelize.transaction();
    try {
      const taskOperator = await TasksOperators.findOne({ where: { ID_task, ID_user }, transaction: t });
      if (!taskOperator) {
        console.log('TaskOperator not found');
        await t.rollback();
        return res.status(404).json({ error: 'Asignación no encontrada.' });
      }
      console.log('Found taskOperator:', taskOperator.get({ plain: true }));

      await taskOperator.update({ ID_operator_task_states }, { transaction: t });
      console.log('Updated taskOperator:', taskOperator.get({ plain: true }));

      const task = await Task.findByPk(ID_task, { transaction: t });
      if (!task) {
        console.log('Task not found after update');
        await t.rollback();
        return res.status(404).json({ error: 'Tarea no encontrada.' });
      }
      console.log('Found task:', task.get({ plain: true }));

      const plainTask = task.get({ plain: true });
      const generalTaskId = plainTask.ID_general_tasks;
      console.log('Extracted generalTaskId:', generalTaskId);

      const allTasks = await Task.findAll({ where: { ID_general_tasks: generalTaskId }, transaction: t });
      console.log('Found allTasks:', allTasks.map(tt => tt.get({ plain: true })));

      // Buscar dinámicamente los estados "completado" (operador y general)
      let operatorCompletedState = await OperatorTaskState.findOne({ where: { name: { [Op.iLike]: '%complet%' } }, transaction: t });
      let generalCompletedState = await GeneralTaskState.findOne({ where: { name: { [Op.iLike]: '%complet%' } }, transaction: t });

      console.log('operatorCompletedState raw:', operatorCompletedState ? operatorCompletedState.get({ plain: true }) : null);
      console.log('generalCompletedState raw:', generalCompletedState ? generalCompletedState.get({ plain: true }) : null);

      // Usar .get(...) para evitar problemas con propiedades undefined
      let operatorCompletedId = 2;
      let generalCompletedId = 2;
      if (operatorCompletedState) {
        try {
          const val = operatorCompletedState.get('ID_operator_task_states');
          if (val !== undefined && val !== null) operatorCompletedId = Number(val);
        } catch (e) {
          console.warn('Could not read operatorCompletedState ID directly, using fallback 2', e);
        }
      }
      if (generalCompletedState) {
        try {
          const val = generalCompletedState.get('ID_general_task_states');
          if (val !== undefined && val !== null) generalCompletedId = Number(val);
        } catch (e) {
          console.warn('Could not read generalCompletedState ID directly, using fallback 2', e);
        }
      }

      console.log('Resolved operatorCompletedId:', operatorCompletedId, 'generalCompletedId:', generalCompletedId);

      // Nuevo enfoque: comprobar por tarea individual.
      // Una tarea se considera completada sólo si tiene al menos un operador asignado y
      // todos los operadores de esa tarea están en el estado operatorCompletedId.
      let allCompleted = true;

      for (const tsk of allTasks) {
        const taskPlain = tsk.get({ plain: true });
        const taskId = taskPlain.ID_task;
        console.log('Checking Task ID:', taskId);

        const taskOperators = await TasksOperators.findAll({ where: { ID_task: taskId }, transaction: t });
        console.log(' - Found operators for task:', taskId, taskOperators.map(o => o.get({ plain: true })));

        // Si una tarea no tiene operadores asignados, consideramos que NO está completa
        if (!taskOperators || taskOperators.length === 0) {
          console.log(` - Task ${taskId} has no operators -> not completed`);
          allCompleted = false;
          break;
        }

        const taskAllOpsCompleted = taskOperators.every(op => Number(op.get('ID_operator_task_states')) === Number(operatorCompletedId));
        console.log(` - Task ${taskId} all operators completed?`, taskAllOpsCompleted);
        if (!taskAllOpsCompleted) {
          allCompleted = false;
          break;
        }
      }

      console.log('Final allCompleted result:', allCompleted);

      if (allCompleted && allTasks.length > 0) {
        console.log('All tasks are completed, proceeding to update general task.');
        // Actualizar dentro de la transacción
        const [affectedRows] = await GeneralTask.update(
          { ID_general_task_states: generalCompletedId },
          { where: { ID_general_tasks: generalTaskId }, transaction: t }
        );
        console.log('GeneralTask update affected rows:', affectedRows);
        if (affectedRows > 0) {
          const refreshed = await GeneralTask.findByPk(generalTaskId, { transaction: t });
          console.log('GeneralTask after update:', refreshed ? refreshed.get({ plain: true }) : null);
        } else {
          console.log('No rows updated for GeneralTask (maybe already had that state).');
        }
      } else {
        console.log('Not all tasks are completed, skipping general task update.');
      }

      await t.commit();
    } catch (errInner) {
      console.error('Inner error, rolling back transaction:', errInner);
      await t.rollback();
      throw errInner;
    }

    res.status(200).json({ data: taskOperator });
  } catch (error: any) {
    console.error('--- ERROR in updateTaskOperatorState ---', error);
    res.status(500).json({ error: error.message });
  }
  console.log('--- Finished updateTaskOperatorState ---');
};

// Pausar una tarea-operador: actualizar observations y poner en estado "pausado" la tarea general
const pauseTaskOperator = async (req: Request, res: Response) => {
  console.log('--- Starting pauseTaskOperator ---');
  try {
    const { ID_task, ID_user } = req.params;
    const { observations, ID_operator_task_states } = req.body; // mobile puede enviar observaciones y opcionalmente un estado

    const t = await sequelize.transaction();
    try {
      const taskOperator = await TasksOperators.findOne({ where: { ID_task, ID_user }, transaction: t });
      if (!taskOperator) {
        await t.rollback();
        return res.status(404).json({ error: 'Asignación no encontrada.' });
      }

      console.log('Found taskOperator (pause):', taskOperator.get({ plain: true }));

      // Determinar ID del estado "pausado" si no se proporcionó
      let operatorPausedId = undefined as number | undefined;
      if (ID_operator_task_states) operatorPausedId = Number(ID_operator_task_states);
      else {
        // buscar varios patrones comunes para "pausado"
        const patterns = ['%paus%', '%pause%', '%parad%', '%deten%'];
        const whereOr = patterns.map(p => ({ name: { [Op.iLike]: p } }));
        const found = await OperatorTaskState.findOne({ where: { [Op.or]: whereOr }, transaction: t });
        if (found) operatorPausedId = Number(found.get('ID_operator_task_states'));
      }

      // Actualizar observations y, si tenemos un estado, actualizarlo también
      const updatePayload: any = {};
      if (observations !== undefined) updatePayload.observations = observations;
      if (operatorPausedId !== undefined) updatePayload.ID_operator_task_states = operatorPausedId;

      if (Object.keys(updatePayload).length > 0) {
        await taskOperator.update(updatePayload, { transaction: t });
        console.log('Updated taskOperator (pause):', taskOperator.get({ plain: true }));
      } else {
        console.log('No update payload for taskOperator (pause). Only observations/state not provided or found.');
      }

      // Actualizar la tarea general a estado "pausado" para informar al admin
      const task = await Task.findByPk(ID_task, { transaction: t });
      if (!task) {
        await t.rollback();
        return res.status(404).json({ error: 'Tarea no encontrada.' });
      }
      const generalTaskId = task.get('ID_general_tasks') as number;

      // buscar estado general 'pausado'
      const genPatterns = ['%paus%', '%pause%', '%parad%', '%deten%'];
      const genWhereOr = genPatterns.map(p => ({ name: { [Op.iLike]: p } }));
      const foundGeneral = await GeneralTaskState.findOne({ where: { [Op.or]: genWhereOr }, transaction: t });
      if (foundGeneral) {
        const generalPausedId = Number(foundGeneral.get('ID_general_task_states'));
        const [affected] = await GeneralTask.update({ ID_general_task_states: generalPausedId }, { where: { ID_general_tasks: generalTaskId }, transaction: t });
        console.log('GeneralTask set to paused, affected rows:', affected);
      } else {
        console.warn('No GeneralTaskState found for paused - admin should configure a "paused" state. Skipping general update.');
      }

      await t.commit();
      return res.status(200).json({ data: taskOperator });
    } catch (errInner) {
      console.error('Inner error in pauseTaskOperator, rolling back:', errInner);
      await t.rollback();
      throw errInner;
    }
  } catch (error: any) {
    console.error('--- ERROR in pauseTaskOperator ---', error);
    return res.status(500).json({ error: error.message });
  }
};

const getOperatorsWorkload = async (req: Request, res: Response) => {
    try {
        // Determinar el ID del estado "completado" dinámicamente para excluirlo
        const operatorCompletedState = await OperatorTaskState.findOne({ where: { name: { [Op.iLike]: '%complet%' } } });
        const completedId = operatorCompletedState ? operatorCompletedState.ID_operator_task_states : 2;
        console.log('getOperatorsWorkload - excluding state ID (completed):', completedId);

        const workload = await TasksOperators.findAll({
          attributes: [
            [fn('COUNT', col('ID_task')), 'taskCount']
          ],
          where: {
            // Excluir tareas cuyos operator_task_state sean 'completado'
            ID_operator_task_states: { [Op.ne]: completedId }
          },
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
  
export { createTaskOperator, updateTaskOperatorState, getOperatorsWorkload, getTasksByOperatorId, pauseTaskOperator };

// Reactivar una tarea general (desde web admin): poner general en proceso, cambiar operadores pausados a en-proceso y limpiar observations
const resumeGeneralTask = async (req: Request, res: Response) => {
  console.log('--- Starting resumeGeneralTask ---');
  try {
    const { id } = req.params; // ID_general_tasks

    const t = await sequelize.transaction();
    try {
      const generalTask = await GeneralTask.findByPk(id, { transaction: t });
      if (!generalTask) {
        await t.rollback();
        return res.status(404).json({ error: 'GeneralTask no encontrada.' });
      }

      // Buscar estado "pausado" para operadores y estado "en proceso" para operadores y general
      const pausedPatterns = ['%paus%', '%pause%', '%parad%', '%deten%'];
      const inProgressPatterns = ['%proceso%', '%en curso%', '%enproceso%', '%activo%', '%in progress%', '%progress%'];

      const pausedWhere = pausedPatterns.map(p => ({ name: { [Op.iLike]: p } }));
      const inProgressWhere = inProgressPatterns.map(p => ({ name: { [Op.iLike]: p } }));

      const pausedOperatorState = await OperatorTaskState.findOne({ where: { [Op.or]: pausedWhere }, transaction: t });
      const inProgressOperatorState = await OperatorTaskState.findOne({ where: { [Op.or]: inProgressWhere }, transaction: t });
      const inProgressGeneralState = await GeneralTaskState.findOne({ where: { [Op.or]: inProgressWhere }, transaction: t });

      if (!inProgressOperatorState || !inProgressGeneralState) {
        await t.rollback();
        return res.status(500).json({ error: 'No se encontró el estado "en proceso" en la configuración. Por favor configura los estados en la base de datos.' });
      }

      const pausedOperatorId = pausedOperatorState ? Number(pausedOperatorState.get('ID_operator_task_states')) : null;
      const inProgressOperatorId = Number(inProgressOperatorState.get('ID_operator_task_states'));
      const inProgressGeneralId = Number(inProgressGeneralState.get('ID_general_task_states'));

      console.log('resumeGeneralTask - pausedOperatorId:', pausedOperatorId, 'inProgressOperatorId:', inProgressOperatorId, 'inProgressGeneralId:', inProgressGeneralId);

      // Obtener tasks relacionadas
      const tasks = await Task.findAll({ where: { ID_general_tasks: id }, transaction: t });
      const taskIds = tasks.map(tt => tt.get('ID_task'));

      // Si existe un estado pausado de operador, actualizar sólo esas filas
      let affectedOperators = 0;
      if (pausedOperatorId !== null) {
        const [affected] = await TasksOperators.update(
          { ID_operator_task_states: inProgressOperatorId, observations: null },
          { where: { ID_task: taskIds, ID_operator_task_states: pausedOperatorId }, transaction: t }
        );
        affectedOperators = affected;
      } else {
        // Si no hay estado "pausado" configurado, actualizamos todas las filas que tengan observations no nulo
        const [affected] = await TasksOperators.update(
          { ID_operator_task_states: inProgressOperatorId, observations: null },
          { where: { ID_task: taskIds, observations: { [Op.ne]: null } }, transaction: t }
        );
        affectedOperators = affected;
      }

      // Actualizar estado general a "en proceso"
      const [affectedGeneral] = await GeneralTask.update({ ID_general_task_states: inProgressGeneralId }, { where: { ID_general_tasks: id }, transaction: t });

      await t.commit();

      const refreshedGeneral = await GeneralTask.findByPk(id);
      return res.status(200).json({ data: { refreshedGeneral: refreshedGeneral ? refreshedGeneral.get({ plain: true }) : null, affectedOperators, affectedGeneral } });
    } catch (inner) {
      console.error('Inner error resumeGeneralTask, rollback:', inner);
      await t.rollback();
      throw inner;
    }
  } catch (error: any) {
    console.error('--- ERROR in resumeGeneralTask ---', error);
    return res.status(500).json({ error: error.message });
  }
};

export { resumeGeneralTask };