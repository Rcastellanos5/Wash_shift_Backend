import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken"
import { checkPassword, hashPassword } from "../util/auth";
import { generateToken } from "../util/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../util/jwt";
import { token } from "morgan";
import { errorMonitor } from "nodemailer/lib/xoauth2";
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
    static confirmatedAccount= async (req:Request, res:Response)=> {
        //Instancia del token 
        const {token}=req.body
        //Se consulta a la bd si existe 
        const user= await User.findOne({where:{token}})
        //Se manda un mensaje de erro si no existe 
        if(!user){
            const error=new Error("No se encontró el usuario")
            res.status(401).json({error:error.message})
        }
        //Confirmed se vuelve true, token null y se guarda en la base de datos 
        user.confirmed=true
        user.token=null
        await user.save()

        res.json("Cuenta confirmada correctamente")

    }
    static login =async (req:Request, res:Response)=>{
        const {email, password}=req.body
        //Se comprueba que el usuario exista
        const user= await User.findOne({where:{email}})
        if (!user){
            const error=new Error("Usuario no encontrado")
            return res.status(409).json({error:error.message})
        }
        //Si el Usuario no esta confirmado
        if (!user.confirmed){
            const error=new Error("Tu cuenta no ha sido confirmada")
            return res.status(403).json({error:error.message})
        }
        //Revisar la contraseña
        const correctPassword= await checkPassword(password, user.password) 
            if(!correctPassword){
                const error=new Error("Contraseña incorrecta")
                return res.status(401).json({error:error.message})
            }
        //Un vez que se ha verificado se genera el JWT
        const token=generateJWT(user.id)
        //
        res.json(token)
        
    }
    static forgotPaswword=async(req:Request, res:Response)=>{
        const {email}=req.body
        const user= await User.findOne({where:{email}})
        if (!user){
            const error =new Error("El usuario no existe")
            return res.status(404).json({error:error.message})
        }
        //Genera un token 
        user.token=generateToken()
        //Lo guarda en la base de datos 
        await user.save()
        //Envia los datos necesarios para el correo 
        await AuthEmail.senfPasswordResetToken({
            name:user.name,
            email:user.email,
            token:user.token

        })

        res.json("Revisa tu Email para isntruciones ")
        
    }
    //Valida el token 
    static validateToken =async(req:Request, res:Response)=>{
        const{token}=req.body
        const tokenexist=await User.findOne({where:{token} })
        if (!tokenexist){
            const error=new Error("Token no valido")
            res.status(404).json({error:error.message})
        }
        res.json("Token válido")

    }
    //Resetea la contraseña 
    static resetPasswordWhitToken =async (req:Request, res:Response)=>{
        const {token}=req.params
        const {password}=req.body
        const user= await User.findOne({where:{token}})
        if (!user){
            const error =new Error("Token no valido")
            res.status(404).json({error:error.message})
        }
        //Llama la funcion que hashea la contraseña 
        user.password= await hashPassword(password)
        user.token=null
        await user.save()
        res.json("El password se modifico correctamente")
    }
    static user= async(req:Request, res:Response)=>{
        const bearer =req.headers.authorization

        if (!bearer){
            const error=new Error("No Autorizado")
            return res.status(401).json({error:error.message})
        }
        const [ ,token]=bearer.split(' ')
        if (!token){
            const error=new Error("Token no valido")
            return res.status(401).json({error:error.message})
        }

        try{
            const decoded=jwt.verify(token, process.env.JWT_SECRET)
            
        }catch(error){
            res.status(500).json({error:'Token no valido'})
        }

    }
}
    