import { Request,Response } from "express";

import TaskStates from "../models/General_task_states.models";

const postTaskStates = async (req:Request,res:Response)=>{
   try {
    const task=await TaskStates.create(req.body)
    res.json({data:task})
   } catch (error) {
    console.log(error)
   }
}

const getTaskStates = async ( req:Request, res: Response ) =>{
    try {
        const task=await TaskStates.findAll()
        res.json({data:task})
    } catch{
        console.log(Error);
        
    }
}

const getTaskStatesForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const task = await TaskStates.findByPk (id)
    if(!task) {
    return res.status(404).json('El estado de la tarea no existe')
    }
    res.json({data: task})
    }catch(error) {
    console.log(error)
    }
}

const putTaskStates = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await TaskStates.findByPk(id);
        if (!task) {
            return res.status(404).json('El usuario no existe');
        }
        await task.update(req.body);
        res.status(200).json({ data: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario."});
    }
}


export {
    postTaskStates,
    getTaskStates,
    getTaskStatesForId,
    putTaskStates
}