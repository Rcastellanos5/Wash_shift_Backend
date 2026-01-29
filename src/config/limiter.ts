import {json} from "express"
import { rateLimit } from "express-rate-limit"
//Limita las vece que se puede enviar peticiones a un servidor
export const limiter =rateLimit({
    //Limita el tiempo en que se puede hacer peticiones 
    windowMs:60*3000,
    //Cuantos peticiones se pueden hacer 
    limit:process.env.NODE_ENV==="development"?5:100,
    message:{"error": "Haz alcanzado en numero limite de peticiones"}
})