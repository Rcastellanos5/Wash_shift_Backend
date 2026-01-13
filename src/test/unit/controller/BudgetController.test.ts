//we used node-mocks-http to simulate our http requests 
import {createRequest, createResponse} from "node-mocks-http"
import { budgets } from "../../mocks/budgets"
import { BudgetController } from "../../../Controllers/BudgetController"
import Budget from "../../../models/Budget"
import Expense from "../../../models/Expense"
jest.mock("../../../models/Budget", ()=>({
    findAll:jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
}))
//test to get all budgets
describe ('BudgetController.getAll', () => {
    //run before each test
    beforeEach(()=>{
        //brings all budgets
        (Budget.findAll as jest.Mock).mockClear();
        (Budget.findAll as jest.Mock).mockImplementation((options)=>{
                //update the budgets based on the user id
                const updatedBudgets=budgets.filter(budget=>budget.userId===options.where.userId);
                return Promise.resolve(updatedBudgets);
        }
        )

    })
    //would retieve 2 budgets for user with ID 1 
    it("should retrieve 2 budgets for user whit ID 1", async()=>{
        

    //we make our query 
    const req= createRequest({
        method:'GET',
        url:"/api/budgets/",
        user:{id:1}
    })
    
        const res=createResponse();
        //we filter the budgets by user id

   

    //we call the method controller
    await BudgetController.getAll(req,res)
    //we expect a 200 response
    const data=res._getJSONData()
    expect(data).toHaveLength(2)
    expect(res.statusCode).toBe(200) 
    expect(res.statusCode).not.toBe(404)
    })

    //would retieve 1 budgets for user with ID 2
    it("should retrieve 1 budgets for user whit ID 2", async()=>{
        

    //we make our query 
    const req= createRequest({
        method:'GET',
        url:"/api/budgets/",
        user:{id:2}
    })
    
        const res=createResponse();

    //we call the method controller
    await BudgetController.getAll(req,res)
    //we expect a 200 response
    const data=res._getJSONData()
    expect(data).toHaveLength(1)
    expect(res.statusCode).toBe(200) 
    expect(res.statusCode).not.toBe(404)
    })

    //would retieve 0 budgets for user with ID 3
    it("should retrieve 0 budgets for user whit ID 3", async()=>{
        const req = createRequest({
            method: 'GET',
            url: "/api/budgets/",
            user: { id: 200 }
        })
        const res = createResponse();

        await BudgetController.getAll(req, res);

        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toBe(404);
    })
     it("should handle errors when fetching budgets", async()=>{
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error("Database error"));
        const req = createRequest({
            method: 'GET',
            url: "/api/budgets/",
            user: { id: 1 }
        })
        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: "Ha ocurrido un error " });
    })
})

describe ('BudgetController.create', () => {
    
    it("should create a new budget and respond whit status code 201", async()=>{
        //create a mock budget instance
    const mockBudget={

        save: jest.fn().mockResolvedValue(true)
    };
    //replace Budget.create with a mock that returns the mockBudget
    (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
        const req=createRequest({
            method: 'POST',
            url:"/api/budgets/",
            user:{id:1},
            body:{
                name:"New Budget",
                amount:5000}

    })
    const res=createResponse();
    await BudgetController.create(req,res)

    const data=res._getJSONData()

    expect(res.statusCode).toBe(201)
    expect(data).toBe("Presupuesto creadao correctamente")
    expect(mockBudget.save).toHaveBeenCalledTimes(1)
    expect(Budget.create).toHaveBeenCalledWith(req.body)
    })
     it("should handle budget creation error whit status code 500", async()=>{
        //create a mock budget instance
   
    //replace Budget.create with a mock that returns the mockBudget
    (Budget.create as jest.Mock).mockResolvedValue(new Error)
        const req=createRequest({
            method: 'POST',
            url:"/api/budgets/",
            user:{id:1},
            body:{
                name:"New Budget",
                amount:5000}

    })
    const res=createResponse();
    await BudgetController.create(req,res)

    const data=res._getJSONData()
    expect(res.statusCode).toBe(500)
    expect(data).toEqual({error:"Hubo un error "})


    })
    
    
})

describe ('BudgetController.getById', () => {
    beforeEach(()=>{
        (Budget.findByPk as jest.Mock).mockImplementation((id)=>{
            //find the budget with the matching id
            const budget =budgets.filter(b => b.id===id)[0];
            return Promise.resolve(budget);
    })
})
    it("should return a budget whit ID 1 and 3 expenses", async()=>{
        const req = createRequest({
            method: 'GET',
            url: "/api/budgets/:id", 
            budget: {id:1}
        })
        const res = createResponse();
        await BudgetController.getbyId(req, res);
        expect(res.statusCode).toBe(200);
        const data = res._getJSONData();
        expect(data.expenses).toHaveLength(3);
        expect(Budget.findByPk).toHaveBeenCalledTimes(1);
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id,{
           //Se trae el presupuesto con los gastos 
            include:[Expense]
        });
        

})
it("should return a budget whit ID 2 and 2 expenses", async()=>{
        const req = createRequest({
            method: 'GET',
            url: "/api/budgets/:id", 
            budget: {id:2}
        })
        const res = createResponse();
        await BudgetController.getbyId(req, res);
        expect(res.statusCode).toBe(200);
        const data = res._getJSONData();
        expect(data.expenses).toHaveLength(2);
        
})
it("should return a budget whit ID 3 and 0 expenses", async()=>{
        const req = createRequest({
            method: 'GET',
            url: "/api/budgets/:id", 
            budget: {id:3}
        })
        const res = createResponse();
        await BudgetController.getbyId(req, res);
        expect(res.statusCode).toBe(200);
        const data = res._getJSONData();
        expect(data.expenses).toHaveLength(0);
        
})

})

describe ('BudgetController.updateById', () => {
    it("should update the budget and return a succes message", async() =>{
        const BudgetMock={
            update: jest.fn().mockResolvedValue(true)
        }
         const req = createRequest({
            method: 'PUT',
            url: "/api/budgets/:budgetid", 
            budget:BudgetMock, 
            body:{name:"Updated Budget", amount:8000}
        })
        const res = createResponse();
        await BudgetController.updatebyid(req, res);

        const data=res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toBe("Se a actualizado correctamente");
        expect(BudgetMock.update).toHaveBeenCalledTimes(1);
        expect(BudgetMock.update).toHaveBeenCalledWith(req.body);
    })
})
describe ('BudgetController.deleteById', () => {
    it("should delete the budget and return a success message", async()=>{
        const BudgetMock={
            destroy: jest.fn().mockResolvedValue(true)
        }
         const req = createRequest({
            method: 'DELETE',
            url: "/api/budgets/:budgetid", 
            budget:BudgetMock,
        })
        const res= createResponse();
        await BudgetController.deletebyid(req,res);
         const data=res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toBe("Se ha eliminado correctamente");
        expect(BudgetMock.destroy).toHaveBeenCalledTimes(1);
        expect(BudgetMock.destroy).toHaveBeenCalledWith(req.body);

    })
})