import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
    // Preprocesar los datos para convertir tipos
    const body = { ...req.body };
    if (body.dni) body.dni = Number(body.dni);
    if (body.ID_type_user) body.ID_type_user = Number(body.ID_type_user);
    if (body.state !== undefined) body.state = body.state === 'true' || body.state === true;
    if (body.specialties) {
        if (typeof body.specialties === 'string') {
            try {
                body.specialties = JSON.parse(body.specialties);
            } catch {
                body.specialties = [];
            }
        }
    }
    if (body.ID_jobs) body.ID_jobs = Number(body.ID_jobs);
    if (body.ID_client) body.ID_client = Number(body.ID_client);
    if (body.ID_general_task_states) body.ID_general_task_states = Number(body.ID_general_task_states);
    if (body.estimated_delivery_date) body.estimated_delivery_date = new Date(body.estimated_delivery_date);

    // avatar_url puede venir como undefined si se usa multer
    if (body.avatar_url === undefined && req.file) {
        body.avatar_url = req.file.path;
    }
    try {
        schema.parse(body);
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