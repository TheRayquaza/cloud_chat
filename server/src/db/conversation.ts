import { DataTypes, Model } from 'sequelize';
import sequelize from './client';

interface ConversationAttributes {
    id: number | null;
    name: string;
    creation_date: Date;
    edition_date: Date;
}

class Conversation extends Model<ConversationAttributes> {}

Conversation.init(
    {
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