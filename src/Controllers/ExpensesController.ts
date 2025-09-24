import Budget from "../models/Budget"
import Expense from "../models/Expense"

import type{Request, Response} from "express"

export class ExpenseController {
    
    static create =async(req:Request, res:Response)=>{
        try{
            //Crea el gasto 
            const expense =new Expense(req.body)
            //Se agrega la llave foranea 
            expense.budgetid=req.budget.id
           //Se guarda en la base de datos 
            await expense.save()
            //Se manda un mensaje de respuesta 
            res.status(201).json("Gasto creado correctamente")
            //En caso de un error
        }catch(error){
            res.status(500).json({error:"Ha ocurrido un error"})
        }
    }
    static getid =async(req:Request, res:Response)=>{
       res.json(req.expense)
    }

    static updatebyid= async (req:Request,res:Response)=>{
        await req.expense.update(req.body)
        res.json("Se a actualizado correctamente ")
    }

    static delatebyid=async(req:Request, res:Response)=>{
        await req.expense.update(req.body)
        res.json("Se ha eliminado correctamente")

    }


}