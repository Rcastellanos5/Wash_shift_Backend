import { transport } from "../config/NodeMailer"

type EmailType = {
    name:string
    email:string
    token:string
}

export class AuthEmail{
    static senfConfirmatioEmail=async(user: EmailType)=>{
        const email= await transport.sendMail({
            from:'WashTicket',
            to:user.email,
            subject:'washTicket - Confirma tu cuenta',
            html:`
            <p>Hola:${user.name}, haz creado tu cuenta en WahTicked,
            <p>Visita el siguiente enlace:</p>
            <a href="#">Confirmar cuenta</a>
            <p> e ingresa el codigo: <b> ${user.token}<b></p>
            `
        })
        console.log(email)

    }
    static senfPasswordResetToken=async(user: EmailType)=>{
        const email= await transport.sendMail({
            from:'WashTicket',
            to:user.email,
            subject:'washTicket - Restablece tu password ',
            html:`
            <p>Hola:${user.name}, haz solicitado restablecer tu password<p>
            <p>Visita el siguiente enlace:</p>
            <a href="#">Restablecer contraseña</a>
            <p> e ingresa el codigo: <b> ${user.token}<b></p>
            `
        })
        console.log(email)

    }
}