import { Request,Response } from "express";

import TypeJob from "../models/Type_job.models";

const postTypeJob = async (req:Request,res:Response)=>{
   try {
    const typeJob=await TypeJob.create(req.body)
    res.json({data:typeJob})

   } catch (error) {
    console.log(error)
   }
}


const getTypeJob = async ( req:Request, res: Response ) =>{
    try {
        const typeJob=await TypeJob.findAll()
        res.json({data:typeJob})

    } catch{
        console.log(Error);
        
    }
}


const getTypeJobForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const typeJob = await TypeJob.findByPk (id)
    if(!typeJob) {
    return res.status(404).json('El typeJob no existe')
    }
    res.json({data: typeJob})

    }catch(error) {
    console.log(error)
    }
}

export {
    postTypeJob,
    getTypeJob,
    getTypeJobForId
}