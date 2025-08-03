import {Router} from "express"
import { postMaterials, getMaterials, getMaterialsForId } from "../handlers/materials"

const routerMaterial= Router();

routerMaterial.post('/', postMaterials),
routerMaterial.get('/', getMaterials),
routerMaterial.get('/:id',  getMaterialsForId)

export default routerMaterial;