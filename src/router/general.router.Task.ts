import {Router} from "express"
import {postTask,getTask,getTaskForId } from "../handlers/generalTask"

const routerTask= Router();

routerTask.post('/', postTask),
routerTask.get('/', getTask),
routerTask.get('/:id',  getTaskForId)

export default routerTask