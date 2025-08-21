
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

export const corsMiddleware = cors(corsOptions);
