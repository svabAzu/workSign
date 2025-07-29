import { Router } from "express";
import { register, login, logout, profile,verify } from "../controllers/auth.controllers";
// import { authRequierd } from '../middlewares/validateToken'
// import { validateSchema } from "../middlewares/validator.middleware";
// import { registerSchema,loginSchema } from "../schemas/auth.schema";

const routerUser = Router();

routerUser.post('/register',/*validateSchema(registerSchema),*/ register);
routerUser.post('/login', /*validateSchema(loginSchema),*/ login);
routerUser.post('/logout', logout);

routerUser.get('/verify', verify);
routerUser.get('/profile', /*authRequierd,*/ profile);

export default routerUser;