import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(1, 'El nombre completo es requerido'),
    last_name: z.string().min(1, 'El nombre completo es requerido'),
    password: z.string().min(3, 'La contraseña debe tener al menos 3 caracteres'),
    email: z.email('Formato de email no válido').min(1, 'El email es requerido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    avatar_url: z.string().min(1, 'La ruta del avatar es requerida'),
    status: z.boolean().optional(),
    specialties: z.array(z.number()),
    dni: z.number().min(1000000, 'DNI no válido').max(99999999, 'DNI no válido'),
    ID_type_user: z.number()

});

export const loginSchema = z.object({
    email: z.email('Email no válido').min(1, 'El email es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});