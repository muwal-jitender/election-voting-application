import {NextFunction, Request, Response} from "express";

import { CustomError } from "../models/error.model";

const notFound = (req:Request, res: Response, next:NextFunction)=>{
  const error = new Error(`Not found- ${req.originalUrl}`);
  res.status(404);
  next(error);
}



const errorHandler = (error:CustomError, req:Request, res: Response, next:NextFunction)=>{
  if(res.headersSent){
    return next(error);
  }
  res.status(error.code || 500).json({message:error.message || "An unknown error occurred."})
}

export {notFound, errorHandler}