import { z } from 'zod';

export const operatorTaskStateSchema = z.object({
  body: z.object({
    name: z.string().min(1, {
      message: 'El nombre es requerido y debe tener al menos 1 caracter'
    }).max(50, {
      message: 'El nombre debe tener como máximo 50 caracteres'
    })
  })
});