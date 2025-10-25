import {Router} from "express"
import { postClient,getClient,getClientForId } from "../handlers/Client"
import { validateSchema } from "../middlewares/validator.middleware"
import { clientSchema } from "../schemas/client.schema"

const routerClient= Router();

routerClient.post('/', validateSchema(clientSchema), postClient),
routerClient.get('/', getClient),
routerClient.get('/:id',  getClientForId)

export default routerClient