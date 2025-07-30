import { Request,Response } from "express";

import TypeUser from "../models/Type_user.models";

const postTypeUser = async (req:Request,res:Response)=>{
   try {
    const typeUser=await TypeUser.create(req.body)
    res.json({data:typeUser})
   } catch (error) {
    console.log(error)
   }
}

export {
    postTypeUser
}