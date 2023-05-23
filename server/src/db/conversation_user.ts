import { Model, DataTypes } from 'sequelize';
import sequelize from './client';

interface ConversationUserAttributes {
    id : number | null;
    conversation_id : number | null;
    user_id : number | null;
}

class ConversationUser extends Model<ConversationUserAttributes> {

    // Delete this
    async delete() : Promise<void> {
        await this.destroy();
    }
}

ConversationUser.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id : {
        type : DataTypes.BIGINT.UNSIGNED,
        allowNull : false,
        references : {
            model : process.env.NAME_TABLE_USER_DB,
            key : 'id',
        }
    },
    conversation_id : {
        type : DataTypes.BIGINT.UNSIGNED,
        allowNull : false,
        references : {
            model : process.env.NAME_TABLE_CONVERSATION_DB,
            key : 'id'
        }
    }
},
{
    sequelize,
    tableName: process.env.NAME_TABLE_CONVERSATION_USER_DB,
    timestamps: false
});

export default ConversationUser;