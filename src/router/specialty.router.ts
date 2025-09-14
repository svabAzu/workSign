import {Router} from "express"
import { postSpecialty, getSpecialty, getSpecialtyForId, putSpecialtyForId, deleteSpecialty } from "../handlers/specialty";

const routerSpecialty= Router();


routerSpecialty.post('/',postSpecialty)

routerSpecialty.get('/', getSpecialty),
routerSpecialty.get('/:id',  getSpecialtyForId)
routerSpecialty.put('/:id', putSpecialtyForId);
routerSpecialty.delete('/:id', deleteSpecialty);



export default routerSpecialty