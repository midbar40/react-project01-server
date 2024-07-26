import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db/sequelize";

// Admin Interface
export interface AdminAttributes {
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

// Admin creaction attributes
export interface AdminCreationAttributes extends Optional<AdminAttributes, "email"> { }

// Admin model
class Admin extends Model<AdminAttributes, AdminCreationAttributes>
    implements AdminAttributes {
    public email!: string;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


// Define the Admin model
Admin.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        modelName: "Admin",
    }
);

export default Admin;