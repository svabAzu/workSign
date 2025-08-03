import {Router} from "express"
import {postTask,getTask,getTaskForId,putTaskForId } from "../handlers/generalTask"

const routerGeneralTask= Router();

routerGeneralTask.post('/', postTask),
routerGeneralTask.get('/', getTask),
routerGeneralTask.get('/:id',  getTaskForId)
routerGeneralTask.put('/:id',  putTaskForId)


export default routerGeneralTask