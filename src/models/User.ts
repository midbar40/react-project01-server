import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db/sequelize";

// User Interface
export interface UserAttributes  {
    email : string;
    company : string;
    name : string;
    contact : string;
    createdAt : Date;
    updatedAt : Date;
}

// user creaction attributes
export interface UserCreationAttributes extends Optional<UserAttributes, "email"> {}

// User model
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public email!: string;
  public company!: string;
  public name!: string;
  public contact!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


// Define the User model
User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
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
      modelName: "User",
    }
  );

export default User;