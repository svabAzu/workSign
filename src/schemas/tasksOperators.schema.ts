import { z } from 'zod';

export const tasksOperatorsSchema = z.object({
  body: z.object({
    ID_task: z.number({
      message: 'El ID de la tarea es requerido y debe ser un número'
    }).int(),
    ID_user: z.number({
      message: 'El ID del usuario es requerido y debe ser un número'
    }).int(),
    observations: z.string({
      message: 'Las observaciones son requeridas'
    }),
    ID_operator_task_states: z.number({
      message: 'El ID del estado de la tarea del operador es requerido y debe ser un número'
    }).int()
  })
});

export const updateTasksOperatorsSchema = z.object({ body: tasksOperatorsSchema.shape.body.partial() });