import {Router} from "express"
import { postUser, getUser, getUserForId, putUserForId, getOperators, putUserState } from "../handlers/users";
import uploadAvatar from "../middlewares/multerAvatar.middleware";

const routerUser= Router();

routerUser.post('/', postUser),
routerUser.get('/', getUser),
routerUser.get('/operators/all', getOperators);
routerUser.get('/:id',  getUserForId)

// Ruta para dar de baja usuario (cambiar state a false)
routerUser.put('/state/:id', putUserState);

routerUser.put('/:id', uploadAvatar.single('avatar_url'), putUserForId);


export default routerUser