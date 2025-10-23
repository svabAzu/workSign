import {Router} from "express"
import {postTaskStates,getTaskStates,getTaskStatesForId,putTaskStates } from "../handlers/generalTaskStates.js"
import { validateSchema } from "../middlewares/validator.middleware"
import { generalTaskStateSchema } from "../schemas/generalTaskStates.schema"

const routerGeneralTaskStates= Router();

routerGeneralTaskStates.post('/', validateSchema(generalTaskStateSchema), postTaskStates),
routerGeneralTaskStates.get('/', getTaskStates),
routerGeneralTaskStates.get('/:id',  getTaskStatesForId)
routerGeneralTaskStates.put('/:id', validateSchema(generalTaskStateSchema),  putTaskStates)

export default routerGeneralTaskStates