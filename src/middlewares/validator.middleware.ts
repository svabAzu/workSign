import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        // Primero, nos aseguramos de que sea un error de Zod
        if (error instanceof ZodError) {
            // Usamos error.issues, que es un array con los detalles
            return res.status(400).json(error.issues.map(issue => issue.message));
        }
        
        // Si es otro tipo de error, devolvemos un error 500 genérico
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}