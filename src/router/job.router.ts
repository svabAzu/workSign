import {Router} from "express"
import { postJob,getJob,getJobForId } from "../handlers/jobs"
import { validateSchema } from "../middlewares/validator.middleware"
import { jobSchema } from "../schemas/job.schema"

const routerJob= Router();

routerJob.post('/', validateSchema(jobSchema), postJob),
routerJob.get('/', getJob),
routerJob.get('/:id',  getJobForId)

export default routerJob;