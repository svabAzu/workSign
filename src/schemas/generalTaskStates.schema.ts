import { z } from 'zod';

export const generalTaskStateSchema = z.object({
  body: z.object({
    name: z.string().min(1, {
      message: 'El nombre es requerido y debe tener al menos 1 caracter'
    }).max(50, {
      message: 'El nombre debe tener como máximo 50 caracteres'
    }),
    color_code: z.string().min(1, {
      message: 'El código de color es requerido y debe tener al menos 1 caracter'
    }).max(7, {
      message: 'El código de color debe tener como máximo 7 caracteres'
    })
  })
});