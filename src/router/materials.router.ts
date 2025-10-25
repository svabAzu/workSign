import {Router} from "express"
import { postMaterials, getMaterials, getMaterialsForId } from "../handlers/materials"
import { validateSchema } from "../middlewares/validator.middleware"
import { materialSchema } from "../schemas/materials.schema"

const routerMaterial= Router();

routerMaterial.post('/', validateSchema(materialSchema), postMaterials),
routerMaterial.get('/', getMaterials),
routerMaterial.get('/:id',  getMaterialsForId)

export default routerMaterial;