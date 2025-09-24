import type {Request, Response} from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
    static getAll =async(req: Request,res:Response)=>{

        try{
            const budget =await Budget.findAll({
                order:[
                    ['createdAt', 'DESC']
                ]
                //TODO: filtar por el usuario
            })
            res.json(budget)

        }catch(error){
            res.status(500).json({error:"Ha ocurrido un error "})
        }
    }
    //Crea un presupuesto 
    static create =async(req: Request,res:Response)=>{
       try{
            //Crea un instacia
            const budget= new Budget(req.body)
           //Se manda a la base datos 
            await budget.save()
            //Respuesta por parte del sevidor
            res.status(201).json("Presupuesto creadao correctamente")

       }catch(error){
            //Si hay un error
            res.status(500).json({error:"Hubo un error "})
    
       }

    }
    //Obtiene un presupuesto con el id 
    static getbyId =async(req: Request, res:Response)=>{
        //Se hace la consulta al prosupuesto
        const budget=await Budget.findByPk(req.budget.id,{
           //Se trae el presupuesto con los gastos 
            include:[Expense]
        })

        res.json(budget)
    }
    //actualiza con el id 
    static updatebyid =async(req:Request, res:Response)=>{
        //Se actualiza en la base de datos 
            await req.budget.update(req.body)
            res.json("Se a actualizado correctamente")

    }
    //Elimina con el id 
    static deletebyid =async(req:Request, res:Response)=>{
          //Se elimina de la base de datos 
            await req.budget.destroy(req.body)
            res.json("Se ha eliminado correctamente")
    }
}