import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ITodo {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  providerId: number;
}

// Sequelize requires some attributes to be optional when creating a model
interface TodoCreationAttributes extends Optional<ITodo, "id"> {}

// Extending Model with ITodo and TodoCreationAttributes
export interface TodoInstance
  extends Model<ITodo, TodoCreationAttributes>,
    ITodo {}

class Todo extends Model<ITodo, TodoCreationAttributes> implements ITodo {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
  public userId!: number;
  public providerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const TodoModel = (sequelize: Sequelize): typeof Todo => {
  const todo = Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize, // Use the Sequelize instance from db_connections
      tableName: "todos",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return todo;
};

export default TodoModel;
