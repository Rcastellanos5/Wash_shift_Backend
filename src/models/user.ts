import { Table, Column, Model,DataType, HasMany, Default, Unique, AllowNull} from "sequelize-typescript";
import Budget from "./Budget";
//Nombre de la tabla 
@Table ({
    tableName:"users"
})
//Tipo de dato 
class User extends Model{
    //Name model 
    //No pueder ir vacion 
    @AllowNull(false)
    @Column({
        type:DataType.STRING(50)
    })
    declare name: string
    //password model 
    @AllowNull(false)
    @Column({
        type: DataType.STRING(60)
    })
    declare password: string
    //email model 
    //Indica que el correo tiene que ser unico 
    @Unique(true)
    @AllowNull(false)
    @Column ({
        type: DataType.STRING(50)
    })
    declare email: string
    //Token model 
    @Column ({
        type: DataType.STRING(50)
    })
    declare token:string
    //confimation token model 

    //La confirmacion del token por default esta en false 
    @Default(false)
    @Column ({
        type: DataType.BOOLEAN
    })
    declare confirmed: boolean

    //Un usuario puede tener varios presupuestos 
    @HasMany(()=>Budget,{
        //Se elimina y actualiza en cascada
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
    })
    //Arreglo con los presupuestos asociados 
    declare budgets: Budget[]
}
export default User