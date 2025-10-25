
import cors from 'cors';

const allowedOrigins = [
    'http://localhost:5173',
    'https://pabloproyectos.com.ar',
    'https://www.pabloproyectos.com.ar',
    'https://app.pabloproyectos.com.ar', // Agrega aquí tu dominio de producción si es diferente
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

export const corsMiddleware = cors(corsOptions);
