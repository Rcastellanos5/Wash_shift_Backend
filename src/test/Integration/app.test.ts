import request  from "supertest"
import { AuthController } from "../../Controllers/authcontroller"
import server, { connectDB } from "../../server"
import { response } from "express"
import { token } from "morgan"

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