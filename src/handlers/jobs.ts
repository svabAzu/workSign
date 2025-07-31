import { Request,Response } from "express";

import Jobs from "../models/Jobs.models";

const postJob = async (req:Request,res:Response)=>{
   try {
    const job=await Jobs.create(req.body)
    res.json({data:job})
   } catch (error) {
    console.log(error)
   }
}

const getJobs = async ( req:Request, res: Response ) =>{
    try {
        const job=await Jobs.findAll()
        res.json({data:job})
    } catch{
        console.log(Error);
        
    }
}

const getJobsForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const job = await Jobs.findByPk (id)
    if(!job) {
    return res.status(404).json('El estado de la tarea no existe')
    }
    res.json({data: job})
    }catch(error) {
    console.log(error)
    }
}

export {
    postJob,
    getJobs,
    getJobsForId
}