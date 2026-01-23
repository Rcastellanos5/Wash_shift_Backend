import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../Controllers/authcontroller";
import User from "../../../models/user";
import { hashPassword } from "../../../util/auth";
import { generateToken } from "../../../util/token";
import { AuthEmail } from "../../../emails/AuthEmail";

jest.mock("../../../models/user")
jest.mock("../../../util/auth")
jest.mock("../../../util/token")

describe("AuthController.CreateAcount", () => {
    //Reset all mocks before each test
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("Should return 409 status and an error messasge when trying to create an account with an existing email", async () => {
       (User.findOne as jest.Mock).mockResolvedValue(true)
        const req = createRequest({
            method: "POST",
            url: "/api/auth/create-account",
            body: {
                email: "test@2example.com",
                password: "password123",
            }
        })
        const res = createResponse();

        await AuthController.createAccount(req, res);
        const data = res._getJSONData()
        expect(res.statusCode).toBe(409)
        expect(data).toEqual({error:"Un usuario con este email ya esta registrado"})
        
    })
    it("should register a new user and return success message", async () => {
    
        const req = createRequest({
            method: "POST",
            url: "/api/auth/create-account",
            body: {
                email: "test@2example.com",
                password: "password123",
                name: "Test User"
            }
        })
        const res = createResponse();
        const mockUser = {...req.body, save: jest.fn()};
        //Resolved by asynchronous functions
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
        //Return by synchronous functions
        (generateToken as jest.Mock).mockReturnValue("123456");
        //Simulate email sending
        jest.spyOn(AuthEmail,"senfConfirmatioEmail").mockImplementation(() => Promise.resolve());

        await AuthController.createAccount(req, res);
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(User.create).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.password).toBe("hashedPassword");
        expect(mockUser.token).toBe("123456");
        expect(AuthEmail.senfConfirmatioEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: "123456"
        });
        expect(res.statusCode).toBe(201);
    })
})