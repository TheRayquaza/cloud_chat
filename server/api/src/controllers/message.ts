import { Request, Response } from "express";
import Message from "../../../db/models/message";
import Conversation from "../../../db/models/conversation";
import User from "../../../db/models/user";
import ConversationUser from "../../../db/models/conversation_user";
import { controller_logger } from "../logger";
import { send_error, send_result, send_success } from "../scripts/send";

// POST /api/message
// required body : content, user_id, conversation_id
export const new_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("New message");
    let conversation : Conversation | null, user : User | null, conversation_user : ConversationUser | null;
    const { conversation_id, content } = req.body;
    const user_id = req.headers["X-id"] as string;

    if (!conversation_id || !content)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            conversation = await Conversation.findByPk(conversation_id);
            user = await User.findByPk(user_id);
            if (!conversation || !user)
                send_error(res, 404, "Conversation or user not found");
            else {
                conversation_user = await ConversationUser.findOne({where: { conversation_id: conversation_id, user_id: user_id}});
                if (!conversation_user)
                    send_error(res, 404, "User not in conversation");
                else {
                    let user_id_number : number = parseInt(user_id, 10);
                    const message = await conversation.add_message(user_id_number, content);
                    send_result(res, 201, message);
                }
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};

// DELETE /api/message/{id}
export const delete_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("Delete message");
    try {
        const id = req.params.id
        controller_logger.info("delete message " + id);
        const nb: number = await Message.destroy({where: {id: id}})

        if (nb === 0)
            send_error(res, 404, "Message not found");
        else
            send_success(res, 200);
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};

// GET /api/message/{id}
export const get_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("Get Message")
    const id = req.params.id;
    try {
        let message : Message | null;

        message = await Message.findByPk(id);
        if (!message)
            send_error(res, 404, "Message not found");
        else
            send_result(res, 200, message);
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};

// PUT /api/message/{id}
// required body : content
export const modify_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("Modify message");
    try {
        const id = req.params.id;
        controller_logger.info("modifying message " + id);

        const { content } = req.body;
        let message : Message | null = await Message.findByPk(id);
        if (!message)
            send_error(res, 404, "Message not found");
        else {
            message.setDataValue("content",content);
            message.setDataValue("edition_date", new Date());
            await message.save();
            send_result(res, 200, message);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};