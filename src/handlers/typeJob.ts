import { Request,Response } from "express";

import TypeJobs from "../models/Jobs_typejob.models";

const postTypeJob = async (req:Request,res:Response)=>{
   try {
    const job=await TypeJobs.create(req.body)
    res.json({data:job})
   } catch (error) {
    console.log(error)
   }
}

const getTypeJobs = async ( req:Request, res: Response ) =>{
    try {
        const job=await TypeJobs.findAll()
        res.json({data:job})
    } catch{
        console.log(Error);
        
    }
}

const getTypeJobsForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const job = await TypeJobs.findByPk (id)
    if(!job) {
    return res.status(404).json('El estado de la tarea no existe')
    }
    res.json({data: job})
    }catch(error) {
    console.log(error)
    }
}

export {
    postTypeJob,
    getTypeJobs,
    getTypeJobsForId
}