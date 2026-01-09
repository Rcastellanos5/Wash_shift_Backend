import type { Request, Response, NextFunction } from "express"
import  jwt from "jsonwebtoken"
import User from "../models/user"
declare global{
    namespace Express{
        interface Request{
            user?:User
        }
    }
}
export const authenticate=async(req:Request, res:Response, next:NextFunction )=>{
    
      //Obtiene el token desde los headers 
        const bearer =req.headers.authorization
        //Si no hay header authorization devuelve un error 
        if (!bearer){
            const error=new Error("No Autorizado")
            return res.status(401).json({error:error.message})
        }
        //Se para el bearer del token verdadero "
        const [ ,token]=bearer.split(' ')
        //Si no hay token devuelve un error 
        if (!token){
            const error=new Error("Token no valido")
            return res.status(401).json({error:error.message})
        }
        

        try{
            //Verifica el token con la palabra secreta 
            const decoded=jwt.verify(token, process.env.JWT_SECRET)
           //Devuelve los datos codificados 
            if (typeof decoded==='object'&&decoded.id){
                req.user=await User.findByPk(decoded.id,{
                    attributes:["id", "name", "email"]
                }) 
                next()
            }
            
            //Si el token no es valido devuelve un error
        }catch(error){
            res.status(500).json({error:'Token no valido'})
        }

    }
