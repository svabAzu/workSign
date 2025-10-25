import { z } from 'zod';

export const generalTaskSchema = z.object({
  title: z.string().min(1, {
    message: 'El título es requerido y debe tener al menos 1 caracter'
  }).max(100, {
    message: 'El título debe tener como máximo 100 caracteres'
  }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  estimated_delivery_date: z.date({ message: 'La fecha de entrega es requerida' }),
  ID_jobs: z.number({ message: 'El id del trabajo es requerido' }).int(),
  ID_client: z.number({ message: 'El id del cliente es requerido' }).int(),
  ID_general_task_states: z.number({ message: 'El id del estado de la tarea es requerido' }).int().optional()
});