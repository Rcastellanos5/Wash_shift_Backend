import { Router } from "express";
import { handleInputErrors } from "../middleware/validatio";
import { AuthController } from "../Controllers/authcontroller";
import { body, param } from "express-validator";
import { limiter } from "../config/limiter";
const router=Router()
//Aplica el limitador de peticiones
router.use(limiter)
//Validacion de los campos de crear cuenta 
//Ruta para crear una cuenta 
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
//Validacion del token 
//Ruta para confirmart una cuenta 
router.post('/confirm-account',

    body("token")
        .notEmpty()
        .isLength({min:6,max:6})
        .withMessage("Toke no valido"),
    handleInputErrors,
    AuthController.confirmatedAccount,

)
//Ruta del Login 
router.post("/login",
    body("email")
        .isEmail().withMessage("Correo no valido"),
    body("password")
        .notEmpty().withMessage("La contraseña no puede ir vacia"),
    handleInputErrors,
    AuthController.login
)
//Ruta de olvidar contraseña 
router.post("/Forgot-Password",
    body("email")
    .isEmail().withMessage("El email no es correcto")
    ,handleInputErrors,
    AuthController.forgotPaswword
)
//Ruta de validar token 
router.post("/validate-token",
    body("token")
    .notEmpty()
    .isLength({max:6,min:6})
    .withMessage("Token no valido")
    ,handleInputErrors,
    AuthController.validateToken
)
//Ruta de cambiar de contraseña 
router.post("/reset-password/:token",
    param("token")
        .notEmpty()
        .isLength({min:6, max:6})
        .withMessage("Token no valido"),
    body("password")
    .isLength({min:8}).withMessage("La contrseña es muy corta, minimo 8 caractere"),
    handleInputErrors,
    AuthController.resetPasswordWhitToken
)
router.get('/user',
    AuthController.user
)

export default router