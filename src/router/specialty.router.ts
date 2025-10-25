import {Router} from "express"
import { postSpecialty, getSpecialty, getSpecialtyForId, putSpecialtyForId, deleteSpecialty } from "../handlers/specialty";
import { validateSchema } from "../middlewares/validator.middleware";
import { specialtySchema } from "../schemas/specialty.schema";

const routerSpecialty= Router();


routerSpecialty.post('/', validateSchema(specialtySchema), postSpecialty)

routerSpecialty.get('/', getSpecialty),
routerSpecialty.get('/:id',  getSpecialtyForId)
routerSpecialty.put('/:id', validateSchema(specialtySchema), putSpecialtyForId);
routerSpecialty.delete('/:id', deleteSpecialty);



export default routerSpecialty