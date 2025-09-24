import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'
//Se configura dotenv
dotenv.config()

export const db= new Sequelize (process.env.DATABASE_URL, {
    //Para que posgrest pueda encontrar la carpeta modelos 
    models: [__dirname + '/../models/**/*' ],
    logging: false,
    dialectOptions: {
        ssl:{
            require:true
        }
    }
})