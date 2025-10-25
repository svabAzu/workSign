import Task from "../models/Task.models";
import GeneralTask from "../models/General_tasks.models";
import User from "../models/Users.models";
import OperatorTaskState from "../models/Operator_task_states.models";
import MaterialsTasks from "../models/Materials_tasks.models";
import Material from "../models/Materials.models";
import { Op } from "sequelize";
import TasksOperators from "../models/Tasks_operators.models";

import sequelize from '../config/db'; 

/**
 * Crea una nueva tarea específica para una tarea general.
 * @param data Datos de la tarea a crear.
 * @returns La tarea creada con sus relaciones.
 */
const createTaskHandler = async (body: any) => {
  const t = await sequelize.transaction();

  try {
    const { operators, materials, ...taskData } = body;

    // 1. Crear la tarea principal en la tabla 'task'
    const newTask = await Task.create(taskData, { transaction: t });

    // 2. Usar el ID de la nueva tarea para crear las relaciones

    // Relación con Operadores
    if (operators && operators.length > 0) {
      // Necesitamos un array de objetos con ID y campos adicionales para la tabla intermedia
      const operatorsData = operators.map((op: any) => ({
        ID_users: op.ID_users,
        assignment_date: op.assignment_date,
        observations: op.observations, // Asegúrate de incluir este campo en tu JSON
        ID_operator_task_states: op.ID_operator_task_states,
      }));
      
      for (const operator of operatorsData) {
        await newTask.$add('user', operator.ID_users, { 
          through: {
            assignment_date: operator.assignment_date,
            observations: operator.observations,
            ID_operator_task_states: operator.ID_operator_task_states,
          },
          transaction: t
        });
      }
    }

    // Relación con Materiales (la lógica original es correcta)
    if (materials && materials.length > 0) {
      for (const material of materials) {
        await newTask.$add('material', material.ID_materials, { 
          through: {
            observations: material.observations,
          },
          transaction: t
        });
      }
    }

    // 3. Confirmar la transacción
    await t.commit();

    return newTask;
  } catch (error) {
    // Si algo falla, revertir todos los cambios
    await t.rollback();
    throw error;
  }
};

/**
 * Obtiene todas las tareas con sus relaciones.
 * @returns Array de tareas.
 */
const getAllTasksHandler = async () => {
  try {
    const tasks = await Task.findAll({
      // Incluimos directamente las tablas intermedias
      include: [
        {
          model: TasksOperators,
          as: 'taskOperators', // Alias corregido para coincidir con la asociación
          attributes: ['assignment_date', 'observations'],
          // Incluimos el usuario y el estado del operador, que están asociados a la tabla intermedia
          include: [
            {
              model: User,
              as: 'user', // Este 'include' solo necesita el modelo User
            },
            {
              model: OperatorTaskState, // ¡Corregido! Incluimos el estado del operador aquí
            }
          ]
        },
        {
          model: MaterialsTasks,
          as: 'materialsTasks', // Alias corregido para coincidir con la asociación
          attributes: ['observations'],
          // Incluimos el material asociado a través de la tabla intermedia
          include: [
            {
              model: Material,
              as: 'material'
            }
          ]
        }
      ]
    });
    return tasks;
  } catch (error) {
    console.error("Error en el controlador al obtener las tareas:", error);
    throw error;
  }
};

/**
 * Obtiene una tarea por su ID con sus relaciones correctamente anidadas.
 * @param id ID de la tarea.
 * @returns La tarea encontrada o null si no existe.
 */
const getTaskByIdHandler = async (id: number) => {
  try {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: GeneralTask,
          as: 'generalTask'
        },
        // Inclusión anidada para la relación de muchos a muchos con User y OperatorTaskState
        {
          model: TasksOperators,
          as: 'taskOperators', // Alias de la tabla intermedia
          include: [
            {
              model: User,
              as: 'user',
              // No incluyas OperatorTaskState aquí, ya que no es una asociación directa de User
            },
            {
              model: OperatorTaskState, // Esta es la asociación correcta para OperatorTaskState
            }
          ]
        },
        // Inclusión anidada para la relación de muchos a muchos con Material
        {
          model: MaterialsTasks,
          as: 'materialsTasks', // Alias de la tabla intermedia
          include: [
            {
              model: Material,
              as: 'material',
            }
          ]
        },
      ]
    });
    return task;
  } catch (error) {
    console.error("Error en getTaskByIdHandler:", error);
    throw error;
  }
};


/**
 * Obtiene todas las tareas asociadas a un ID_general_tasks específico con sus relaciones.
 * @param generalTaskId ID del generalTask.
 * @returns Un array de tareas encontradas.
 */
const getTasksByGeneralTaskIdHandler = async (generalTaskId: number) => {
  try {
    const tasks = await Task.findAll({
      where: {
        ID_general_tasks: generalTaskId // Aquí se aplica el filtro por ID_general_tasks
      },
      include: [
        {
          model: GeneralTask,
          as: 'generalTask'
        },
        // Inclusión anidada para la relación de muchos a muchos con User y OperatorTaskState
        {
          model: TasksOperators,
          as: 'taskOperators', // Alias de la tabla intermedia
          include: [
            {
              model: User,
              as: 'user',
            },
            {
              model: OperatorTaskState, // Esta es la asociación correcta para OperatorTaskState
            }
          ]
        },
        // Inclusión anidada para la relación de muchos a muchos con Material
        {
          model: MaterialsTasks,
          as: 'materialsTasks', // Alias de la tabla intermedia
          include: [
            {
              model: Material,
              as: 'material',
            }
          ]
        },
      ]
    });
    return tasks;
  } catch (error) {
    console.error("Error en getTasksByGeneralTaskIdHandler:", error);
    throw error;
  }
};


/**
 * Actualiza una tarea por su ID.
 * Se usa una transacción para asegurar que todos los cambios sean atómicos.
 * @param id ID de la tarea a actualizar.
 * @param data Datos a actualizar, incluyendo las relaciones.
 * @returns La tarea actualizada con sus relaciones.
 */
const updateTaskHandler = async (id: number, data: any) => {
  const t = await sequelize.transaction();
  try {
    const task = await Task.findByPk(id, { transaction: t });
    if (!task) {
      await t.rollback();
      return null;
    }

    // Actualizar los campos directos de la tarea
    await task.update(data, { transaction: t });

    // Actualizar la relación con Operadores
    if (data.operators) {
      // Primero, elimina todas las relaciones existentes en la tabla intermedia
      await TasksOperators.destroy({ where: { ID_task: id }, transaction: t });
      
      // Luego, crea las nuevas relaciones con los campos 'through'
      for (const operatorData of data.operators) {
        // Debes usar el alias 'user' aquí, ya que así se define la asociación
        await (task as any).$add('user', operatorData.ID_users, {
          through: {
            assignment_date: operatorData.assignment_date,
            observations: operatorData.observations,
            ID_operator_task_states: operatorData.ID_operator_task_states,
          },
          transaction: t
        });
      }
    }

    // Actualizar la relación con Materiales
    if (data.materials) {
      // Primero, elimina todas las relaciones existentes
      await MaterialsTasks.destroy({ where: { ID_task: id }, transaction: t });

      // Luego, crea las nuevas relaciones
      for (const materialData of data.materials) {
        // Debes usar el alias 'material' aquí
        await (task as any).$add('material', materialData.ID_materials, {
          through: {
            quantity: materialData.quantity,
            observations: materialData.observations,
          },
          transaction: t
        });
      }
    }

    await t.commit();

    // Después de la actualización, obtenemos la tarea con todas sus relaciones
    const taskWithRelations = await getTaskByIdHandler(id);
    return taskWithRelations;

  } catch (error) {
    await t.rollback();
    console.error("Error en updateTaskHandler:", error);
    throw error;
  }
};

/**
 * Elimina una tarea por su ID, eliminando primero las dependencias en cascada.
 * @param id ID de la tarea a eliminar.
 * @returns Número de filas eliminadas.
 */
const deleteTaskHandler = async (id: number) => {
  const t = await sequelize.transaction();

  try {
    // 1. Eliminar los registros relacionados en la tabla intermedia 'materials_tasks'
    await MaterialsTasks.destroy({
      where: { ID_task: id },
      transaction: t,
    });

    // 2. Eliminar los registros relacionados en la tabla intermedia 'tasks_operators'
    await TasksOperators.destroy({
      where: { ID_task: id },
      transaction: t,
    });

    // 3. Eliminar la tarea principal de la tabla 'task'
    const result = await Task.destroy({
      where: { ID_task: id },
      transaction: t,
    });

    // 4. Confirmar la transacción
    await t.commit();

    return result;
  } catch (error) {
    // Si algo falla, revertir todos los cambios
    await t.rollback();
    console.error("Error en deleteTaskHandler:", error);
    throw error;
  }
};

export {
    createTaskHandler,
    getAllTasksHandler,
    getTaskByIdHandler,
    getTasksByGeneralTaskIdHandler,
    updateTaskHandler,
    deleteTaskHandler
};