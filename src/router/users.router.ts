import {Router} from "express"
import { postUser,getUser,getUserForId,putUserForId } from "../handlers/users";

const routerUser= Router();

routerUser.post('/', postUser),
routerUser.get('/', getUser),
routerUser.get('/:id',  getUserForId)
routerUser.put('/:id', putUserForId);

export default routerUser