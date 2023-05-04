import {DataTypes, Model} from "sequelize";
import sequelize from "./client";

interface UserAttributes {
    id: number | null;
    username: string;
    password_hash: string;
    permission : number;
    last_connection: Date;
    creation_date : Date;
}

class User extends Model<UserAttributes>{}

User.init(
    {
        id: {type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true},
        username: {type: DataTypes.STRING(255), allowNull: false, unique: true},
        password_hash: {type: DataTypes.STRING(255), allowNull: false},
        permission: {type: DataTypes.TINYINT, allowNull: false, defaultValue : 0},
        last_connection: {type: DataTypes.DATE, allowNull: false, defaultValue : DataTypes.NOW},
        creation_date : {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    },
    {
        sequelize,
        timestamps : false,
        tableName: process.env.NAME_TABLE_USER_DB,
    }
);

export default User;