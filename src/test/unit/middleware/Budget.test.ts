import {createRequest, createResponse} from "node-mocks-http"
import { validateBudgetExist, hasAcces } from "../../../middleware/budge"
import Budget from "../../../models/Budget"
import { budgets } from "../../mocks/budgets"

jest.mock("../../../models/Budget", ()=>({

    findByPk: jest.fn(),
}))
describe("budget - validateBudgetExists", () => {
    it("should handle non existing budget", async()=>{
        (Budget.findByPk as jest.Mock).mockResolvedValue(null);
        const req=createRequest({
            params:{
                 budgetId:1
            }
        })
        const res=createResponse();
        const next=jest.fn();

        await validateBudgetExist(req,res,next);
        expect(res.statusCode).toBe(404);
        const data=res._getJSONData();
        expect(data).toEqual({error:"Presupuesto no encontrado"});
        expect(next).not.toHaveBeenCalled();

     })
     it("should pass for existing budget", async()=>{

        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);
        const req=createRequest({
            params:{
                 budgetId:1
            }
        })
        const res=createResponse();
        const next=jest.fn();

        await validateBudgetExist(req,res,next);
        
        expect(next).toHaveBeenCalled();
        expect(req.budget).toEqual(budgets[0]);
        

     }
     )
      it("should pass for not existing budget", async()=>{

        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error());
        const req=createRequest({
            params:{
                 budgetId:1
            }
        })
        const res=createResponse();
        const next=jest.fn();

        await validateBudgetExist(req,res,next);
        const data=res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error:"Ha ocurrido un error"});
        expect(next).not.toHaveBeenCalled();

     }
     )

})
describe("budget - hasAccess", () => {
    it("should call nest if user has access ", async()=>{
        const req=createRequest({  
            budget:budgets[0],
            user:{id:1}
        })
        const res=createResponse();
        const next=jest.fn();   
        await hasAcces(req,res,next);
        expect(next).toHaveBeenCalled();

    })
    it("should not call nest if user doesn't has access ", async()=>{
        const req=createRequest({  
            budget:budgets[0],
            user:{id:2}
        })
        const res=createResponse();
        const next=jest.fn();   
        await hasAcces(req,res,next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);

    })


})