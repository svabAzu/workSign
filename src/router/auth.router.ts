import { Router } from "express";
import { register, login, logout, profile,verify } from "../controllers/auth.controllers";
import { authRequierd } from '../middlewares/validateToken'
 import { validateSchema } from "../middlewares/validator.middleware";
 import { registerSchema,loginSchema } from "../schemas/auth.schema";
import uploadAvatar from '../middlewares/multerAvatar.middleware';

const routerAuth = Router();

routerAuth.post('/register',
    uploadAvatar.single('avatar'), // Recibe el archivo con el campo 'avatar'
    /*authRequierd,*/ 
    validateSchema(registerSchema), 
    register);
routerAuth.post('/login', validateSchema(loginSchema), login);
routerAuth.post('/logout', logout);

routerAuth.get('/verify', verify);
routerAuth.get('/profile', authRequierd, profile);

export default routerAuth;