import express from 'express' 
import colors, { blue } from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'
import { limiter } from './config/limiter'
export async function connectDB() {
    try{
        //Intenta conectar a la base de datos 
        await db.authenticate()
        //Crea las tablas en automatico 
        db.sync()
        console.log(colors.blue.bold('Conexion exitosa a la BD'))
    } catch(error){
        console.log(colors.red.bold("Fallo la conexion a la base de datos"))
    }
    
}
connectDB()
//Se crea una instacia de express
const app = express()
//
app.use(morgan('dev'))
//Se utiliza para poder leer los formularios 
app.use(express.json())

//llama la ruta de budgetRouter 
app.use('/api/budgets', budgetRouter)
app.use('/api/auth',authRouter )

app.use('/', (req, res) => {
    res.send("API is running...")
})





export default app