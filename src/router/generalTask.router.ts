import {Router} from "express"
import { postTask, getTask, getTaskForId, putTaskForId, updateTaskState } from "../handlers/generalTask";
import uploadSketch from '../middlewares/multerSketch.middleware';

const routerGeneralTask= Router();

routerGeneralTask.post('/', uploadSketch.single('sketch_url'), postTask);
routerGeneralTask.get('/', getTask),
routerGeneralTask.get('/:id',  getTaskForId)
routerGeneralTask.put('/:id',  putTaskForId)
routerGeneralTask.put('/state/:id', updateTaskState)


export default routerGeneralTask