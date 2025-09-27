import jwt from "jsonwebtoken" 
//Genera un JWT
export const generateJWT=(id:string)=>{
    
    const token= jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
    return token
}