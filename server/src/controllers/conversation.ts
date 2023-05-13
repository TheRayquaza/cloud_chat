import { Request, Response } from "express";
import Conversation from "../db/conversation";
import ConversationUser from "../db/conversation_user";
import User from "../db/user";
import { controller_logger } from "../logger";
import { send_error, send_result, send_success } from "../scripts/send";

// POST /api/conversation
// required body : name, user_id
export const new_conversation = async (req: Request, res: Response): Promise<void> => {
    controller_logger.info("new conversation");

    const {name, users_id} = req.body;
    let conversation : Conversation, user : User | null, conversation_user : ConversationUser | null,
        user_instances : Array<User> = [], not_found : boolean = true;

    if (!name || !users_id)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            for (let i : number = 0; i < users_id.length; i++) {
                user = await User.findByPk(users_id[i]);
                if (user)
                    user_instances.push(user);
                else {
                    not_found = false;
                    break;
                }
            }
            if (not_found)
                send_error(res, 404, "One or multiple users do not exist");
            else {
                conversation = await Conversation.create({
                    name: name,
                    id : null,
                    creation_date : new Date(),
                    edition_date : new Date()
                });
                for (let i : number = 0; i < user_instances.length; i++) {
                    conversation_user = await ConversationUser.findOne({ where : { user_id : user_instances[i].dataValues.id, conversation_id : conversation.dataValues.id }});
                    if (!conversation_user) {
                        conversation_user = await ConversationUser.create({
                            id: null,
                            user_id: user_instances[i].dataValues.id,
                            conversation_id: conversation.dataValues.id
                        });
                        await conversation_user.save();
                        console.log("Hello world")
                    }
                }
                await conversation.save();
                send_result(res, 200, conversation);
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};

// DELETE /api/conversation/{id}
export const delete_conversation = (req: Request, res: Response): void => {
    const id = req.params.id;
    controller_logger.info("delete conversation " + id);
    Conversation.destroy({ where: { id: id } })
        .then((nb) => {
            if (nb === 0) send_error(res, 404, "conversation not Found");
            else send_success(res);
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        });
};

// GET /api/conversation/{id}
export const get_conversation = (req: Request, res: Response): void => {
    const id = req.params.id;
    controller_logger.info("get conversation " + id);
    Conversation.findByPk(id)
        .then((conversation) => {
            if (!conversation) send_error(res, 404, "conversation not Found");
            else send_result(res, 200, conversation);
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        });
};

// PUT /api/conversation/{id}
// required body : name
export const modify_conversation = (req: Request, res: Response): void => {
    const id = req.params.id;
    const { name } = req.body;
    controller_logger.info("modifying conversation " + id);
    Conversation.update(
        { name: name, edition_date: new Date() },
        { where: { id: id } }
    ).catch((err) => {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    });
}