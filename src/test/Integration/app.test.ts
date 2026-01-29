import request  from "supertest"
import { AuthController } from "../../Controllers/authcontroller"
import server, { connectDB } from "../../server"
import { response } from "express"

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