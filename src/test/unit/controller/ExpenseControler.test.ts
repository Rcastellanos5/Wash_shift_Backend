import { createRequest, createResponse } from "node-mocks-http";
import { ExpenseController } from "../../../Controllers/ExpensesController";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/Expenses";
jest.mock("../../../models/Expense", () => ({
    create: jest.fn(),
})
);
describe("ExpenseController.create", () => {
    
    it("should create an expense successfully", async () => {
        const ExpenseMock = {
            save: jest.fn().mockResolvedValue(true),
        };
        (Expense.create as jest.Mock).mockResolvedValue(ExpenseMock);
        const req = createRequest({
            method: "POST",
            url: "/api/budgets/:Budgetid/expense",
            body:{
                name:"New Expense",
                amount:2000
            },
            budget: {
                id:1
            } 
        })
        const res = createResponse();
        
        await ExpenseController.create(req, res);
        const data=res._getJSONData();
        expect(data).toEqual("Gasto creado correctamente");
        expect(res.statusCode).toBe(201);
        expect(ExpenseMock.save).toHaveBeenCalledTimes(1);
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    })
    it("should create a error whit status code 500 ", async () => {
        const ExpenseMock = {
            save: jest.fn().mockRejectedValue(new Error()),
        };
        (Expense.create as jest.Mock).mockResolvedValue(new Error);
        const req = createRequest({
            method: "POST",
            url: "/api/budgets/:Budgetid/expense",
            body:{
                name:"New Expense",
                amount:2000
            },
            budget: {
                id:1
            } 
        })
        const res = createResponse();
        
        await ExpenseController.create(req, res);
        const data=res._getJSONData();
        
        expect(res.statusCode).toBe(500);
        expect(ExpenseMock.save).not.toHaveBeenCalled();

      
    })
})
describe("ExpenseController.getid", () => {
    it("should return expense whit id:1", async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/expenses/:Budgetid/expense/:expenseid",
            expense: expenses[0]
        })
        const res = createResponse();
        
        await ExpenseController.getid(req, res);
        const data=res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(expenses[0]);
    })
})
describe("ExpenseController.updateById", () => {
    it("should handle expense update", async () => {
        const expenseMock = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: "PUT",
            url: "/api/expenses/:Budgetid/expense/:expenseid",
            expense: expenseMock,
            body:{
                name:"Updated Expense",
                amount:2500
            }
        })
        const res = createResponse();
        
        await ExpenseController.updatebyid(req,res);
        const data=res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Se ha actualizado correctamente ");
        
    })
})
describe("ExpenseController.deleteById", () => {
    it("should delete expense and return succes message", async () => {
        const expenseMock = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: "DELETE",
            url: "/api/expenses/:Budgetid/expense/:expenseid",
            expense: expenseMock,
            
        })
        const res = createResponse();
        
        await ExpenseController.delatebyid(req,res);
        const data=res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Se ha eliminado correctamente");
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
        expect(expenseMock.destroy).toHaveBeenCalled();
        
    })
})