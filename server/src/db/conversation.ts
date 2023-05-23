import { DataTypes, Model } from 'sequelize';
import sequelize from './client';
import ConversationUser from './conversation_user';
import User from './user';
import Message from './message';

interface ConversationAttributes {
    admin_id : number | null;
    id: number | null;
    name: string;
    creation_date: Date;
    edition_date: Date;
}

class Conversation extends Model<ConversationAttributes> {

    // Get all users from this conversation
    async get_users() : Promise<User[]> {
        let res : User[] = [];
        const conversation_users : ConversationUser[] = await ConversationUser.findAll({ where: { conversation_id : this.dataValues.id } });
        for (let i : number = 0; i < conversation_users.length; i++)
            if (conversation_users[i] && conversation_users[i].dataValues.user_id) {
                const user : User | null = await User.findByPk(conversation_users[i].dataValues.user_id as number);
                if (user)
                    res.push(user);
            }
        return res;
    }

    // Get all messages from this conversation
    async get_messages() : Promise<Message[]> {
        return await Message.findAll({ where: { conversation_id : this.dataValues.id } });
    }

    // Get all messages from this conversation
    async get_messages_from_user(user_id : number) : Promise<Message[]> {
        return await Message.findAll({ where: { conversation_id : this.dataValues.id, user_id : user_id } });
    }

    // Get all conversation users from this conversation
    async get_conversation_users() : Promise<ConversationUser[]> {
        return await ConversationUser.findAll({ where: { conversation_id : this.dataValues.id } });
    }

    // Get admin from this conversation
    async get_admin() : Promise<User> {
        const admin : User | null = await User.findByPk(this.dataValues.admin_id as number);
        if (admin) return admin;
        else throw new Error("Admin not found");
    }

    // Add user to the conversation
    async add_user(user_id : number) : Promise<void> {
        let conversation_user : ConversationUser | null = await ConversationUser.findOne({ where: { user_id : user_id, conversation_id : this.dataValues.id } });
        if (!conversation_user) {
            conversation_user = await ConversationUser.create({ user_id : user_id, conversation_id : this.dataValues.id, id : null });
            await conversation_user.save();
        }
    }

    // Remove user from the conversation
    async remove_user(user_id : number) : Promise<void> {
        const conversation_user = await ConversationUser.findOne({ where: { user_id : user_id, conversation_id : this.dataValues.id } });
        if (conversation_user) await conversation_user.delete();
        await this.delete_messages_from_user(user_id);
    }

    // Delete message from conversation from a specific user
    async delete_messages_from_user(user_id : number) : Promise<void> {
        const messages : Message[] = await this.get_messages_from_user(user_id);
        for (let i : number = 0; i < messages.length; i++)
            await messages[i].destroy();
    }

    // Delete this conversation
    // - Delete conversation users from this conversation
    // - Delete all messages from this conversation
    // - Delete this conversation
    async delete() : Promise<void> {
        // Delete conversation users from this conversation
        const conversation_users : ConversationUser[] = await this.get_conversation_users();
        for (let i : number = 0; i < conversation_users.length; i++)
            await conversation_users[i].destroy();

        // Delete all messages from this conversation
        const messages : Message[] = await this.get_messages();
        for (let i : number = 0; i < messages.length; i++)
            await messages[i].destroy();

        // Delete this conversation
        await this.destroy();
    }
}

Conversation.init(
    {
        admin_id : { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        creation_date: { type: DataTypes.DATE, allowNull: false },
        edition_date: { type: DataTypes.DATE, allowNull: false },
    },
    {
        timestamps: false,
        tableName: process.env.NAME_TABLE_CONVERSATION_DB,
        sequelize: sequelize,
    },
);

export default Conversation;