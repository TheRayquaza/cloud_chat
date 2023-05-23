import {DataTypes, Model} from "sequelize";
import sequelize from "./client";
import Conversation from "./conversation";
import ConversationUser from "./conversation_user";
import Message from "./message";

interface UserAttributes {
    id: number | null;
    username: string;
    password_hash: string;
    permission : number;
    last_connection: Date;
    creation_date : Date;
}

class User extends Model<UserAttributes>{

    // Get all conversations from this user where it is admin
    async get_own_conversations() : Promise<Conversation[]> {
        return await Conversation.findAll({ where: { admin_id : this.dataValues.id } })
    }

    // Get all conversations from this user
    async get_conversations() : Promise<Conversation[]> {
        const conversation_users = await this.get_conversations_user();
        let res : Conversation[] = [];
        for (let i : number = 0; i < conversation_users.length; i++)
            if (conversation_users[i] && conversation_users[i].dataValues.conversation_id) {
                const conversation : Conversation | null = await Conversation.findByPk(conversation_users[i].dataValues.conversation_id as number);
                if (conversation)
                    res.push(conversation);
            }
        return res;
    }

    // Get all conversations user from this user
    async get_conversations_user() : Promise<ConversationUser[]> {
        return await ConversationUser.findAll({ where: { user_id : this.dataValues.id } });
    }

    // Get all messages from this user
    async get_messages() : Promise<Message[]> {
        return await Message.findAll({ where: { user_id : this.dataValues.id } });
    }

    // Delete this user
    // - Delete all conversations from this user
    // - Delete all conversations user from this user
    // - Delete this user
    async delete() : Promise<void> {
        // Delete all conversations from this user
        const conversations : Conversation[] = await this.get_own_conversations();
        for (let i : number = 0; i < conversations.length; i++)
            await conversations[i].delete();

        // Delete all conversations user from this user
        const conversation_users : ConversationUser[] = await this.get_conversations_user();
        for (let i : number = 0; i < conversation_users.length; i++)
            await conversation_users[i].delete();

        // Delete this user
        await this.destroy();
    }
}

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