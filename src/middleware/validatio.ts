import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
//Verifica que no haya errores en la validacion 
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    //Instacia un error 
    let errors = validationResult(req)
    //Si lo hay manda un JSON con error 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
    
}