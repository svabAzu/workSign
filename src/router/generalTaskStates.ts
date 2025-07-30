import {Router} from "express"
import {postTaskStates,getTaskStates,getTaskStatesForId } from "../handlers/GeneralTaskStates"

const routerTaskStates= Router();

routerTaskStates.post('/', postTaskStates),
routerTaskStates.get('/', getTaskStates),
routerTaskStates.get('/:id',  getTaskStatesForId)

export default routerTaskStates