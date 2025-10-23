import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, {
    message: 'El nombre es requerido y debe tener al menos 1 caracter'
  }).max(100, {
    message: 'El nombre debe tener como máximo 100 caracteres'
  }),
  company: z.string().min(1, {
    message: 'La compañía es requerida y debe tener al menos 1 caracter'
  }).max(100, {
    message: 'La compañía debe tener como máximo 100 caracteres'
  }),
  phone: z.string().min(1, {
    message: 'El teléfono es requerido y debe tener al menos 1 caracter'
  }).max(15, {
    message: 'El teléfono debe tener como máximo 15 caracteres'
  })
});