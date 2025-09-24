import { Router } from "express";
import { handleInputErrors } from "../middleware/validatio";
import { AuthController } from "../Controllers/authcontroller";
import { body } from "express-validator";
const router=Router()

router.post('/create-account',
    body("name")
        .notEmpty().withMessage("El nombre no pude ir vacio"),
    body("password")
    .isLength({min:8}).withMessage("El password es muy corto, minimo 8 caracteres"),
    body("email")
        .isEmail().withMessage("E-mail no valido")
    ,
    handleInputErrors,
    AuthController.createAccount )


export default router