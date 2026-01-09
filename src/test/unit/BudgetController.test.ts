//we used node-mocks-http to simulate our http requests 
import {createRequest, createResponse} from "node-mocks-http"
import { budgets } from "../mocks/budgets"
import { BudgetController } from "../../Controllers/BudgetController"
import Budget from "../../models/Budget"
jest.mock("../../models/Budget", ()=>({
    findAll:jest.fn(),
    create: jest.fn()
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
    //create a mock budget instance
    const mockBudget={

        save: jest.fn().mockResolvedValue(true)
    };
    //replace Budget.create with a mock that returns the mockBudget
    (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
    it("should create a new budget and respond whit status code 201", async()=>{
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
})
