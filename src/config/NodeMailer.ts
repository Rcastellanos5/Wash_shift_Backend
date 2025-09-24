import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
//Se llaman las variables de entornpo
dotenv.config()
//Configuración necesaeria para conectarse al servidor 
const config =()=>{
    return{
        host:process.env.EMAIL_HOST ,
        port:+process.env.EMAIL_PORT ,
        auth: {
            user:process.env.EMAIL_USER ,
            pass:process.env.EMAIL_PASS
        } 
    }

}
//Trasnporte para poder enviar a otras partes de la aplicacion 
export const transport = nodemailer.createTransport(config());