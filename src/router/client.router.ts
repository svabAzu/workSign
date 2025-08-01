import {Router} from "express"
import { postClient,getClient,getClientForId } from "../handlers/client"

const routerClient= Router();

routerClient.post('/', postClient),
routerClient.get('/', getClient),
routerClient.get('/:id',  getClientForId)

export default routerClient