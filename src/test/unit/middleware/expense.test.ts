import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExist } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/Expenses";
import { hasAcces } from "../../../middleware/budge";
import { budgets } from "../../mocks/budgets";
jest.mock("../../../models/Expense", () => ({
        findByPk: jest.fn()

}))
describe("Expense Middleware - validateExpenseExist", () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) =>{
            const expense= expenses.filter(e=> e.id===id)[0] ?? null
            return Promise.resolve(expense)
        })
    })
   it("should handle a non-existing expense", async () => {
        const req = createRequest({
            params: { expenseid: 120}

        })
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExist(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: "Gasto no encontrado" });
        expect(next).not.toHaveBeenCalled();
    })
   it("should call next middleware if expense exists", async () => {
        const req = createRequest({
            params: { expenseid: 1}

        })
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExist(req, res, next);
        

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.expense).toEqual(expenses[0]);
    })
    it("should handle internal server error", async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params: { expenseid: 1}

        })
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExist(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(next).not.toHaveBeenCalled();
        expect(data).toEqual("Ha ocurrido un error");
 
    })
    it("should prevent unauthorized users from adding expenses", async () => {
        const req = createRequest({
            method: "POST",
            url: "/api/expenses/:Budgetid/expense",
            budget:budgets[0],
            user:{id:20},
            body:{
                name:"New Expense",
                amount:2000
            }
        })
        const res = createResponse();
        const next = jest.fn();
        hasAcces(req, res, next);
        const data=res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({error:"Accion no valida"})
        expect(next).not.toHaveBeenCalled();
        

    })
})