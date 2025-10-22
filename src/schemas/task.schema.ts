import { z } from 'zod';

const operatorSchema = z.object({
  ID_users: z.number().int(),
  assignment_date: z.string(),
  ID_operator_task_states: z.number().int()
});

const materialSchema = z.object({
  ID_materials: z.number().int(),
  observations: z.string()
});

export const taskSchema = z.object({
  title: z.string().min(1, {
    message: 'El título es requerido y debe tener al menos 1 caracter'
  }).max(100, {
    message: 'El título debe tener como máximo 100 caracteres'
  }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  ID_general_tasks: z.number({ message: 'El ID de la tarea general es requerido' }).int(),
  operators: z.array(operatorSchema),
  materials: z.array(materialSchema)
});