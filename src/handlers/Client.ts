import { Request,Response } from "express";

import Client from "../models/Client.models";

const postClient = async (req:Request,res:Response)=>{
   try {
    const client=await Client.create(req.body)
    res.json({data:client})
   } catch (error) {
    console.log(error)
   }
}

const getClient = async ( req:Request, res: Response ) =>{
    try {
        const client=await Client.findAll()
        res.json({data:client})
    } catch{
        console.log(Error);
        
    }
}

const getClientForId = async (req: Request, res: Response) =>{
    try{
    const{id}=req.params
    const client = await Client.findByPk (id)
    if(!client) {
    return res.status(404).json('El cliente no existe')
    }
    res.json({data: client})
    }catch(error) {
    console.log(error)
    }
}

export {
    postClient,
    getClient,
    getClientForId
}