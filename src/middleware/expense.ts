
import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult} from "express-validator";
import Budget from "../models/Budget";
import Expense from "../models/Expense";
declare global{
    namespace Express{
        interface Request{
            expense?:Expense
        }
    }
}
export const  validateExpenseInput =async(req:Request, res:Response, next:NextFunction)=>{
    await body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio")
    
    await body("amount")
        .isNumeric().withMessage("Cantidad no valida")
        .notEmpty().withMessage("Este campo no puede ir vacio ")
        .custom(value=>value>0).withMessage("El valor debe ser mayor a 0 ")

    next()
}

export const validateExpenseid =async(req:Request, res:Response, next:NextFunction)=>{
    await param("expenseid")
        .isInt().withMessage("Id no valido ")
        .custom(value=>value>0).withMessage("El id no es valido")
        .run(req)
         let errors = validationResult(req)
            //Si lo hay manda un JSON con error 
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            

    next()

}
export const validateExpenseExist =async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {expenseid}=req.params
        const expense=await Expense.findByPk(expenseid)
        if(!expense){
            const error =new Error ("Gasto no encontrado")
            return res.status(404).json({error:error.message})
        }
        req.expense=expense
        return next()

    }catch(error){
        res.status(500).json("Ha ocurrido un error")
    }
}