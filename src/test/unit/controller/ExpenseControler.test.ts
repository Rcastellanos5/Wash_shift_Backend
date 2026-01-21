import { createRequest, createResponse } from "node-mocks-http";
import { ExpenseController } from "../../../Controllers/ExpensesController";
import Expense from "../../../models/Expense";
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