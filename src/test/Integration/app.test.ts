import request  from "supertest"
import { AuthController } from "../../Controllers/authcontroller"
import server, { connectDB } from "../../server"
import e, { response } from "express"
import { token } from "morgan"
import * as  authutils from "../../util/auth"
import * as jwtutils from "../../util/jwt"
import User from "../../models/user"

describe("Authentication - Create Acount", () => {
    it("should dysplay validations errors when form is empty", async () => {
        const response = await request(server)
                        .post("/api/auth/create-account")
                        .send({})
        const createAccountMock=jest.spyOn(AuthController, 'createAccount')
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(3)
        expect(response.body).toHaveProperty("errors")
        expect(createAccountMock).not.toHaveBeenCalled()
    })
     it("should return 400 when email is invalid", async () => {
        const response = await request(server)
                        .post("/api/auth/create-account")
                        .send({
                            name: "Test User",
                            email: "invalid-email",
                            password: "validPassword123"
                        })
        const createAccountMock=jest.spyOn(AuthController, 'createAccount')
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(1)
        expect(response.body).toHaveProperty("errors")
        expect(createAccountMock).not.toHaveBeenCalled()
    })
     it("should return 400 when password is invalid", async () => {
        const response = await request(server)
                        .post("/api/auth/create-account")
                        .send({
                            name: "Test User",
                            email: "Valid@gmail.com",
                            password: "123"
                        })
                
        const createAccountMock=jest.spyOn(AuthController, 'createAccount')
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(1)
        expect(response.body).toHaveProperty("errors")
        expect(createAccountMock).not.toHaveBeenCalled()
    })
        it("should return 201 when account is created successfully", async () => {
            const userData = {
                name: "Test User",
                email: "Valid@gmail.com",
                password: "validPassword123"
            }
        const response = await request(server)
                        .post("/api/auth/create-account")
                        .send(userData)
                

        
        expect(response.body).not.toHaveProperty("errors")
        expect(response.status).toBe(201)
        
    })
     it("should return 409 status when a user already exists", async () => {
            const userData = {
                name: "Test User",
                email: "Valid@gmail.com",
                password: "validPassword123"
            }
        const response = await request(server)
                        .post("/api/auth/create-account")
                        .send(userData)
                

        
        expect(response.body).toHaveProperty("error")
        expect(response.body).not.toHaveProperty("errors")
        expect(response.body.error).toBe("Un usuario con este email ya esta registrado")
        expect(response.status).toBe(409)
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        
        
    })
})

describe("Authentication - Account Confirmation", () => {
    it("should dysplay error if token is empty", async () => {
        const response = await request(server)
                        .post("/api/auth/confirm-account")
                        .send({
                            token:"not_valid"
                        })
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(1)
        expect(response.body).toHaveProperty("errors")
    })
     it("should 401 status error if token is invalid", async () => {
        const response = await request(server)
                        .post("/api/auth/confirm-account")
                        .send({
                            token:"123456"
                        })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("No se encontró el usuario")
    })
     it("should confirm account if token is valid", async () => {
        const token=globalThis.washTicketConfirmationToken
        const response = await request(server)
                        .post("/api/auth/confirm-account")
                        .send({
                            token
                        })
        expect(response.status).toBe(200)
        expect(response.body).toBe("Cuenta confirmada correctamente")
        
    })
})

describe("Authentication - Login", () => {
    //Reset all mocks before each test
    beforeEach(() => {
        jest.resetAllMocks();
    })
    it("should dysplay validations errors when form is empty", async () => {
        const response = await request(server)
                        .post("/api/auth/login")
                        .send({})
        const loginMock=jest.spyOn(AuthController, 'login')
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(2)
        expect(response.body).toHaveProperty("errors")
        expect(loginMock).not.toHaveBeenCalled()
    })
     it("should return 400 status when email is invalid", async () => {
        const response = await request(server)
                        .post("/api/auth/login")
                        .send({
                            email: "invalid-email",
                            password: "12345678"
                        })
        const loginMock=jest.spyOn(AuthController, 'login')
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(1)
        expect(response.body).toHaveProperty("errors")

    })
     it("should return 404 error if the user is not found", async () => {
        const response = await request(server)
                        .post("/api/auth/login")
                        .send({
                            email: "validemail@gmail.com",
                            password: "12345678"
                        })
        
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Usuario no encontrado")
        expect(response.status).not.toBe(200)
        


    })
     it("should return 403 error if the user account is not confirmed", async () => {
        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: false,
                password: "hashedPassword",
                email:"validemail@gmail.com"
            })
        const response = await request(server)
                        .post("/api/auth/login")
                        .send({
                            email: "validemail@gmail.com",
                            password: "hashedPassword"
                        })
        
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Tu cuenta no ha sido confirmada")
        expect(response.status).not.toBe(200)
        


    })
    it("should return 401 error if the password is incorrect", async () => {
        const findOne= (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: "hashedPassword",
                
            })
       const checkPassword= (jest.spyOn(authutils, 'checkPassword') as jest.Mock)
            .mockResolvedValue(false)
        const response = await request(server)
                        .post("/api/auth/login")
                        .send({
                            email: "validemail@gmail.com",
                            password: "wrongPassword"
                        })
        
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Contraseña incorrecta")
        expect(response.status).not.toBe(200)
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledTimes(1)

    })
     it("should return 401 error if the password is incorrect", async () => {
        const findOne= (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: "hashedPassword",
                
            })
       const checkPassword= jest.spyOn(authutils, 'checkPassword') 
            .mockResolvedValue(true)
        const generateJWT= jest.spyOn(jwtutils, 'generateJWT') 
            .mockReturnValue("mocked-jwt-token")
        const response = await request(server)
                        .post("/api/auth/login")
                        .send({
                            email: "validemail@gmail.com",
                            password: "CorrectPassword"
                        })
        expect(response.status).toBe(200)
        expect(response.body).toBe("mocked-jwt-token")
        expect(response.status).not.toBe(401)
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledWith("CorrectPassword", "hashedPassword")
        expect(generateJWT).toHaveBeenCalledWith(1)
        
    })
})
describe("Get /api/budgets", () => {
    let jwt: string;
    beforeAll(() => {
        jest.restoreAllMocks();//restaura los mocks a su implementacion original
    })
    beforeAll(async () => {
        const response=await request(server)
        .post("/api/auth/login")
        .send({
            name: "Test User",
            email: "Valid@gmail.com",
            password: "validPassword123"
        })
        jwt=response.body
        expect(response.status).toBe(200)
    })
    it("should reject unauthenticated access to budgets without a jwt", async () => {
        const response = await request(server)
                        .get("/api/budgets")
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("error")
    })
    it("should reject unauthenticated access to budgets without a valid jwt", async () => {
        const response = await request(server)
                        .get("/api/budgets")
                        .auth("invalid-jwt-token", { type: 'bearer' })  
        expect(response.status).toBe(500)
        expect(response.body).toHaveProperty("error")
    })
    
     it("should allow authenticated access to budgets with a jwt", async () => {
        const response = await request(server)
                        .get("/api/budgets")
                        .auth(jwt, { type: 'bearer' })
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(0)
    })

})