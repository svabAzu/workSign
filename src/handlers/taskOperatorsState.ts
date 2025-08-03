import { Request,Response } from "express";

import OperatorsStates from "../models/Operator_task_states.models";

const postOperatorsStates = async (req:Request,res:Response)=>{
   try {
    const operators=await OperatorsStates.create(req.body)
    res.json({data:operators})
   } catch (error) {
    console.log(error)
   }
}

const getOperatorsStates = async ( req:Request, res: Response ) =>{
    try {
        const operators=await OperatorsStates.findAll()
        res.json({data:operators})
    } catch{
        console.log(Error);
        
    }
}

const getOperatorsStatesForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const operators = await OperatorsStates.findByPk (id)
    if(!operators) {
    return res.status(404).json('El operador no existe')
    }
    res.json({data: operators})
    }catch(error) {
    console.log(error)
    }
}

const putOperatorsStatesForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const operators = await OperatorsStates.findByPk(id);
        if (!operators) {
            return res.status(404).json('El usuario no existe');
        }
        await operators.update(req.body);
        res.status(200).json({ data: operators });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario." });
    }
}

export {
    postOperatorsStates,
    getOperatorsStates,
    getOperatorsStatesForId,
    putOperatorsStatesForId
}