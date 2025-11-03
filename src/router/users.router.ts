import { Router } from "express"
import { postUser, getUser, getUserForId, putUserForId, getOperators, putUserState } from "../handlers/users";
import uploadAvatar from "../middlewares/multerAvatar.middleware";
import { validateSchema } from "../middlewares/validator.middleware";
import { registerSchema, updateUserSchema } from "../schemas/auth.schema";
import { authRequierd } from "../middlewares/validateToken";

const routerUser = Router();

routerUser.post('/', authRequierd, validateSchema(registerSchema), postUser);
routerUser.get('/',
    //authRequierd, 
    getUser);
routerUser.get('/operators/all', authRequierd, getOperators);
routerUser.get('/:id', authRequierd, getUserForId)

// Ruta para dar de baja usuario (cambiar state a false)
routerUser.put('/state/:id', putUserState);

routerUser.put('/:id', uploadAvatar.single('avatar_url'),
    authRequierd,
    //validateSchema(updateUserSchema), 
    putUserForId);


export default routerUser