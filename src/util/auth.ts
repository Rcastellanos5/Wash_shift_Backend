import bcrypt from "bcrypt"

export const hashPassword= async(passwod: string)=>{
    //Son las veces que va a genera una cadeana aleastoria 
    const salt=await bcrypt.genSalt(10)
    //Se guarda en la base de datos
    return await bcrypt.hash(passwod,salt)
}
export const checkPassword=async(passwod:string, hash:string)=>{ 
    return await bcrypt.compare(passwod,hash)
}
