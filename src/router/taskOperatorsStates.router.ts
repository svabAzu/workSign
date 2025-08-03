import {Router} from "express"
import {postOperatorsStates, getOperatorsStates,getOperatorsStatesForId,putOperatorsStatesForId } from "../handlers/taskOperatorsState"

const routerOperatorsStates= Router();

routerOperatorsStates.post('/', postOperatorsStates),
routerOperatorsStates.get('/', getOperatorsStates),
routerOperatorsStates.get('/:id',  getOperatorsStatesForId)
routerOperatorsStates.put('/:id',  putOperatorsStatesForId)


export default routerOperatorsStates