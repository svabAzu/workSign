import { Request,Response } from "express";

import Materials from "../models/Materials.models";

const postMaterials = async (req:Request,res:Response)=>{
   try {
    const materials=await Materials.create(req.body)
    res.json({data:materials})
   } catch (error) {
    console.log(error)
   }
}

const getMaterials = async ( req:Request, res: Response ) =>{
    try {
        const materials=await Materials.findAll()
        res.json({data:materials})
    } catch{
        console.log(Error);
        
    }
}

const getMaterialsForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const materials = await Materials.findByPk (id)
    if(!materials) {
    return res.status(404).json('El material no existe')
    }
    res.json({data: materials})
    }catch(error) {
    console.log(error)
    }
}

export {
    postMaterials,
    getMaterials,
    getMaterialsForId
}