import { Router } from "express"
import { postUser, getUser, getUserForId, putUserForId, getOperators, putUserState } from "../handlers/users";
import uploadAvatar from "../middlewares/multerAvatar.middleware";
import { validateSchema } from "../middlewares/validator.middleware";
import { registerSchema, updateUserSchema } from "../schemas/auth.schema";

const routerUser = Router();

routerUser.post('/', validateSchema(registerSchema), postUser),
    routerUser.get('/', getUser),
    routerUser.get('/operators/all', getOperators);
routerUser.get('/:id', getUserForId)

// Ruta para dar de baja usuario (cambiar state a false)
routerUser.put('/state/:id', putUserState);

routerUser.put('/:id', uploadAvatar.single('avatar_url'),
    //validateSchema(updateUserSchema), 
    putUserForId);


export default routerUser