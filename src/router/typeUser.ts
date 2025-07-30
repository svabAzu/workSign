import {Router} from "express"
import { postTypeUser } from "../handlers/typeUser";

const routerTypeUser= Router();


routerTypeUser.post('/',postTypeUser)



export default routerTypeUser