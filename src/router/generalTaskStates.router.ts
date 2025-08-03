import {Router} from "express"
import {postTaskStates,getTaskStates,getTaskStatesForId,putTaskStates } from "../handlers/generalTaskStates"

const routerTaskStates= Router();

routerTaskStates.post('/', postTaskStates),
routerTaskStates.get('/', getTaskStates),
routerTaskStates.get('/:id',  getTaskStatesForId)
routerTaskStates.put('/:id',  putTaskStates)

export default routerTaskStates