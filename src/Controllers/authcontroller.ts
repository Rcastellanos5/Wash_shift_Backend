import { Request, Response } from "express";
import User from "../models/user";
import { hashPassword } from "../util/auth";
import { generateToken } from "../util/token";
import { AuthEmail } from "../emails/AuthEmail";
export class AuthController{
    static createAccount=async(req:Request, res:Response)=>{
       //Evitar duplicados 
       //se define una instacia 
       const{email, password}=req.body
        //Se consulta si el email ya esta registrado 
       const userExist=await User.findOne({where:{email}})
       //Si es haci retorna un erro 
       if(userExist){
        const error=new Error('Un usuario con este email ya esta registrado')
        res.status(409).json({error:error.message})
       }

        try{
            //Intacia de usuario 
            const user= new User (req.body)
            //Se trae la contraseña y la mandamos a la funcion de hashpasword
            user.password= await hashPassword(password)
           
            //Llamamos la funcion que crea el token 
            user.token=generateToken()   
            //Se guarda en la base de datos 
            await user.save()
            
            AuthEmail.senfConfirmatioEmail({
                name:user.name,
                email:user.email,
                token:user.token
            })

            //Mensaje de confirmacion 
            res.json("Cuenta creada correctamente ")


        }catch(error){
            //console.log(error)
            res.status(500).json({error:"Ha ocurrido un error "})
        }
    }
}