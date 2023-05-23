import {DataTypes, Model} from "sequelize";
import sequelize from "./client";

interface MessageAttributes {
    id: number | null;
    content: string;
    creation_date: Date;
    edition_date: Date;
    conversation_id: number | null;
    user_id: number | null;
}

class Message extends Model<MessageAttributes>{
    // Delete this
    async delete() : Promise<void> {
        await this.destroy();
    }

}

Message.init(
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        content: { type: DataTypes.TEXT, allowNull: false },
        creation_date: { type: DataTypes.DATE, allowNull: false },
        edition_date: { type: DataTypes.DATE, allowNull : false},
        conversation_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, references : { model : process.env.NAME_TABLE_CONVERSATION_DB, key : 'id' }},
        user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, references : { model : process.env.NAME_TABLE_USER_DB, key : 'id'}},
    },
    {
        sequelize,
        timestamps : false,
        tableName: process.env.NAME_TABLE_MESSAGE_DB,
    }
);

export default Message;