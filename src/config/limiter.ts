import {json} from "express"
import { rateLimit } from "express-rate-limit"
//Limita las vece que se puede enviar peticiones a un servidor
export const limiter =rateLimit({
    //Limita el tiempo en que se puede hacer peticiones 
    windowMs:60*1000,
    //Cuantos peticiones se pueden hacer 
    limit:5,
    message:{"error": "Haz alcanzado en numero limite de peticiones"}
})