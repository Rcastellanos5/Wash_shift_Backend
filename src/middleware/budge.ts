import type {Request, Response, NextFunction} from "express"
import {body, param, validationResult} from "express-validator"
import Budget from "../models/Budget"
declare global{
    namespace Express{
        interface Request{
            budget?:Budget
        }
    }
}
//Valida el id 
export const validateBudgetId =async(req:Request, res:Response, next:NextFunction)=>{
    //Toma el campo 
    await param("Budgetid")
    //Comprueba que sea un entero
    .isInt().withMessage("Tiene que ser un entero")
    //Comprueba que se mayor a 0
    .custom(value=>value > 0).withMessage("El id no es valido")
    .run(req)
    let errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    //Sigue con la siguiente funcion 
    return next()

}
//Valida que exista 
export const validateBudgetExist =async(req:Request, res:Response, next:NextFunction)=>{
    
    try{
        
        //Odtiene el id 
        const {Budgetid}=req.params
        //Hace la consulta 
        const budget= await Budget.findByPk(Budgetid)
        //Si no existe envia un mensaje 
        if (!budget){
            const error=new Error("Presupuesto no encontrado")
            return res.status(404).json({error:error.message})
        }

        req.budget=budget
        return next()
    }catch(error){
        return res.status(500).json({error:"Ha ocurrido un error"})
    }
}
//Valida los campos de name y amount 
export const validateBudgetInput = async (req:Request, res:Response, next:NextFunction)=>{
    
        //Traemos el campo
        await body("name")
        //No este bacio 
        .notEmpty().withMessage("No puede ir vacio")
        .run(req),

        await body("amount") 
        //Que sea un numerico 
        .isNumeric().withMessage("El valor debe de ser numerico")
        //Que no este vacio 
        .notEmpty().withMessage("No puede ir vacio este campo")
        //que sea mayor a 0 
        .custom(value=>value >0).withMessage("Tiene que ser mayor a 0")
        .run(req)
    return next()
    
}