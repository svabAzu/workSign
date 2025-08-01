import {Router} from "express"
import { postJob,getJob,getJobForId } from "../handlers/jobs"

const routerJob= Router();

routerJob.post('/', postJob),
routerJob.get('/', getJob),
routerJob.get('/:id',  getJobForId)

export default routerJob;