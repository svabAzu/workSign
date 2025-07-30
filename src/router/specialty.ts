import {Router} from "express"
import { postSpecialty } from "../handlers/specialty";

const routerSpecialty= Router();


routerSpecialty.post('/',postSpecialty)



export default routerSpecialty