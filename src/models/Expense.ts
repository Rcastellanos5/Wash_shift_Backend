import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import Budget from "./Budget";
//Se define el nombre de la tabla
@Table({
    tableName:"expenses"
})

class Expense extends Model{
    //Se define las columnas y el tipo de datos 
    @AllowNull
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string
    @AllowNull
    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number
    //Llave foranea 
    @ForeignKey(()=>Budget)
    declare budgetid: number
    //Un budget pertenece a un expense
    @BelongsTo(()=>Budget)
    declare budget: Budget
}
export default Expense