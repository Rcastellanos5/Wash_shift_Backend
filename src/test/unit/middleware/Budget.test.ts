import {createRequest, createResponse} from "node-mocks-http"
import { validateBudgetExist } from "../../../middleware/budge"
import Budget from "../../../models/Budget"
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
})