import {Router} from "express"
import { postSpecialty, getSpecialty, getSpecialtyForId, putSpecialtyForId } from "../handlers/specialty";

const routerSpecialty= Router();


routerSpecialty.post('/',postSpecialty)

routerSpecialty.get('/', getSpecialty),
routerSpecialty.get('/:id',  getSpecialtyForId)
routerSpecialty.put('/:id', putSpecialtyForId);



export default routerSpecialty