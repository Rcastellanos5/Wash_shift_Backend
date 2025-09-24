//Se importa los decoradores que se van a utilizart 
import {Table, Column, DataType, HasMany, BelongsTo,Model,  ForeignKey, AllowNull}from 'sequelize-typescript'
import Expense from './Expense'
import User from './user'
//Se define un decorador 
//Es algo que envuelve una funcion y le añade cierta caracteristica adicionales sin cambiar la funcion  
@Table({
    //Se define el nombre que va a tener la tabla 
tableName:'budgets'
})
class Budget extends Model{
    //Se declara las columnas y los typos de datos 
    @AllowNull(false)
    @Column({
        type:DataType.STRING(100)//Especifica que la columna es de tipo texto
    })
    //Atributo columna de la tabla 
    declare name: string
    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL    
    })
    declare amount: number 
    //Relacion uno a munchos 
    @HasMany(()=>Expense,{
        //Se elimina y actualiza en cascada
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
    })

    declare expenses: Expense[]
    //Almacena el id del usuario como llave foranea 
    @ForeignKey(()=>User)
    declare userId: number
    //Un presupuesto pertenece a un usuarioo 
    @BelongsTo(()=>User)
    declare user:User

}
export default  Budget