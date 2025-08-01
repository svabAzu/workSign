import {Router} from "express"
import { postTypeJob,getTypeJob,getTypeJobForId } from "../handlers/typeJob"

const routerTypeJob= Router();

routerTypeJob.post('/', postTypeJob),
routerTypeJob.get('/', getTypeJob),
routerTypeJob.get('/:id',  getTypeJobForId)

export default routerTypeJob