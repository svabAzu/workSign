import { z } from 'zod';

export const typeJobSchema = z.object({
  body: z.object({
    name: z.string().min(1, {
      message: 'El nombre es requerido y debe tener al menos 1 caracter'
    }).max(100, {
      message: 'El nombre debe tener como máximo 100 caracteres'
    }),
    estimated_duration: z.string().min(1, { message: 'La duración estimada es requerida' })
  })
});