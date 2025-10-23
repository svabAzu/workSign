import {Router} from "express"
import { postTypeUser } from "../handlers/typeUser";
import { validateSchema } from "../middlewares/validator.middleware";
import { typeUserSchema } from "../schemas/typeUser.schema";

const routerTypeUser= Router();


routerTypeUser.post('/', validateSchema(typeUserSchema), postTypeUser)



export default routerTypeUser