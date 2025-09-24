import { Router } from "express";
import {BudgetController} from '../Controllers/BudgetController'
import { body, param } from "express-validator";
import { NotEmpty } from "sequelize-typescript";
import { handleInputErrors } from "../middleware/validatio";
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budge";
import { ExpenseController } from "../Controllers/ExpensesController";
import {validateExpenseExist, validateExpenseid, validateExpenseInput} from "../middleware/expense"
//Se crea la instacia de las rutas 
const router=Router()

//Cada que haya un budget id se ejecuta los siguientes midleware 
router.param("Budgetid", validateBudgetId)
router.param("Budgetid", validateBudgetExist)
router.param("expenseid", validateExpenseid)
router.param("expenseid",validateExpenseExist)


//Define una ruta de tipo get 
router.get('/',
    handleInputErrors,
    BudgetController.getAll)
router.post('/',
    validateBudgetInput,
    handleInputErrors,

    //Si pasa la validacion 
    BudgetController.create)
router.get('/:Budgetid', BudgetController.getbyId)
router.put('/:Budgetid',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updatebyid)
router.delete('/:Budgetid', BudgetController.deletebyid)
/**Routes for expenses */

router.post('/:Budgetid/expense',
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.create)
router.get("/:Budgetid/expense/:expenseid", ExpenseController.getid)
router.put('/:Budgetid/expense/:expenseid', ExpenseController.updatebyid)
router.delete("/:Budgetid/expense/:expenseid", ExpenseController.delatebyid)
export default router   