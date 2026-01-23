import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../Controllers/authcontroller";
import User from "../../../models/user";
import { checkPassword, hashPassword } from "../../../util/auth";
import { generateToken } from "../../../util/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../util/jwt";

jest.mock("../../../models/user")
jest.mock("../../../util/auth")
jest.mock("../../../util/token")
jest.mock("../../../util/jwt")

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
describe("AuthController.Login", () => {
    it("Should return 404 status and an error messasge when trying to Login whit an existing email", async () => {
       (User.findOne as jest.Mock).mockResolvedValue(null)
        const req = createRequest({
            method: "POST",
            url: "/api/auth/Login",
            body: {
                email: "test@2example.com",
                password: "password123",
            }
        })
        const res = createResponse();

        await AuthController.login(req, res);
        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error:"Usuario no encontrado"})
  
        
    })
    it("Should return 403 status and an error messasge if the user is not been confirmed", async () => {
       (User.findOne as jest.Mock).mockResolvedValue({
            id:1,
            email:"test@2example.com",
            confirmed:false
       })
        const req = createRequest({
            method: "POST",
            url: "/api/auth/Login",
            body: {
                email: "test@2example.com",
                password: "password123",
            }
        })
        const res = createResponse();

        await AuthController.login(req, res);
        const data = res._getJSONData()
        expect(res.statusCode).toBe(403)
        expect(data).toEqual({error:"Tu cuenta no ha sido confirmada"})

        
    })
    it("Should return 401 status and an error messasge if the password is incorrect", async () => {
        const userMock={
           id:1,
            email:"test@2example.com",
            confirmed:true,
            password:"hashedPassword" 
        };
       (User.findOne as jest.Mock).mockResolvedValue(userMock)
        const req = createRequest({
            method: "POST",
            url: "/api/auth/Login",
            body: {
                email: "test@2example.com",
                password: "password123",
            }
        })
        const res = createResponse();
        (checkPassword as jest.Mock).mockResolvedValue(false)

        await AuthController.login(req, res);
        const data = res._getJSONData()
        expect(res.statusCode).toBe(401)
        expect(data).toEqual({error:"Contraseña incorrecta"})
        expect(checkPassword).toHaveBeenCalledWith(req.body.password,userMock.password)
        expect(checkPassword).toHaveBeenCalledTimes(1)

        
    })
     it("Should return JWT if auth is successful", async () => {
        const userMock={
           id:1,
            email:"test@2example.com",
            confirmed:true,
            password:"hashedPassword" 
        };
       
        const req = createRequest({
            method: "POST",
            url: "/api/auth/Login",
            body: {
                email: "test@2example.com",
                password: "hashedPassword",
            }
        })
        const res = createResponse();
        const fakeToken="fake-jwt-token";
        (User.findOne as jest.Mock).mockResolvedValue(userMock);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (generateJWT as jest.Mock).mockReturnValue(fakeToken);

        await AuthController.login(req, res);
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toEqual(fakeToken)
        expect(generateJWT).toHaveBeenCalledWith(userMock.id)
        expect(generateJWT).toHaveBeenCalledTimes(1)

        
    })
    
    

})
