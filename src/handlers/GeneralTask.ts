import { Request,Response } from "express";

import GeneralTask from "../models/General_tasks.models";

const postTask = async (req:Request,res:Response)=>{
   try {
    const task=await GeneralTask.create(req.body)
    res.json({data:task})
   } catch (error) {
    console.log(error)
   }
}

const getTask = async ( req:Request, res: Response ) =>{
    try {
        const task=await GeneralTask.findAll()
        res.json({data:task})
    } catch{
        console.log(Error);
        
    }
}

const getTaskForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const task = await GeneralTask.findByPk (id)
    if(!task) {
    return res.status(404).json('El estado de la tarea no existe')
    }
    res.json({data: task})
    }catch(error) {
    console.log(error)
    }
}

export {
    postTask,
    getTask,
    getTaskForId
}