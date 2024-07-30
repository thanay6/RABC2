import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// Define the UserAttributes interface
interface UserAttributes {
  id?: number;
  userName: string;
  email: string;
  role: string[];
  technology: string[];
  type: string[];
  phoneNumber: string;
  password: string; // Include password in UserAttributes
}

// Define the UserCreationAttributes interface
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Define the UserInstance interface extending Model
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

// Define the User class extending Model
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public userName!: string;
  public email!: string;
  public password!: string;
  public role!: string[];
  public type!: string[];
  public technology!: string[];
  public phoneNumber!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the UserModel function
const UserModel = (sequelize: Sequelize): typeof User => {
  const user = User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true, // Ensuring email uniqueness
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      role: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      type: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      technology: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "users", // Preferably use plural table names
      freezeTableName: true,
    }
  );
  return user;
};

export default UserModel;
