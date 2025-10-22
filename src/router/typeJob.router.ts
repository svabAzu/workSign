import {Router} from "express"
import { postTypeJob,getTypeJob,getTypeJobForId } from "../handlers/typeJob"
import { validateSchema } from "../middlewares/validator.middleware"
import { typeJobSchema } from "../schemas/typeJob.schema"

const routerTypeJob= Router();

routerTypeJob.post('/', validateSchema(typeJobSchema), postTypeJob),
routerTypeJob.get('/', getTypeJob),
routerTypeJob.get('/:id',  getTypeJobForId)

export default routerTypeJob