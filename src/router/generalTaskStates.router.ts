import {Router} from "express"
import {postTaskStates,getTaskStates,getTaskStatesForId,putTaskStates } from "../handlers/generalTaskStates"

const routerGeneralTaskStates= Router();

routerGeneralTaskStates.post('/', postTaskStates),
routerGeneralTaskStates.get('/', getTaskStates),
routerGeneralTaskStates.get('/:id',  getTaskStatesForId)
routerGeneralTaskStates.put('/:id',  putTaskStates)

export default routerGeneralTaskStates