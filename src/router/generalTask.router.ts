import {Router} from "express"
import { postTask, getTask, getTaskForId, putTaskForId, updateTaskState } from "../handlers/generalTask";
import uploadSketch from '../middlewares/multerSketch.middleware';
import { validateSchema } from "../middlewares/validator.middleware";
import { generalTaskSchema } from "../schemas/generalTask.schema";

const routerGeneralTask= Router();

routerGeneralTask.post('/', uploadSketch.single('sketch_url'), validateSchema(generalTaskSchema), postTask);
routerGeneralTask.get('/', getTask),
routerGeneralTask.get('/:id',  getTaskForId)
routerGeneralTask.put('/:id', validateSchema(generalTaskSchema),  putTaskForId)
routerGeneralTask.put('/state/:id', updateTaskState)


export default routerGeneralTask