import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

const User = sequelize.define('User',{
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    company :{
        type : DataTypes.STRING,
        allowNull : false
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    contact : {
        type : DataTypes.STRING,
        allowNull : false
    },
})

export default User;