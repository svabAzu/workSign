import { Request,Response } from "express";

import Specialty from "../models/Specialty.models";

const postSpecialty = async (req:Request,res:Response)=>{
   try {
    const specialty=await Specialty.create(req.body)
    res.json({data:specialty})
   } catch (error) {
    console.log(error)
   }
}

export {
    postSpecialty
}