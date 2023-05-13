import { Request, Response } from "express";
import Message from "../db/message";
import Conversation from "../db/conversation";
import User from "../db/user";
import ConversationUser from "../db/conversation_user";
const { controller_logger } = require("../logger");
const { send_error, send_result, send_success } = require("../scripts/send");

// POST /api/message
// required body : content, user_id, conversation_id
export const new_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("New message");
    let conversation : Conversation | null, user : User | null, message : Message | null, conversation_user : ConversationUser | null;
    const { conversation_id, user_id, content } = req.body;

    if (!conversation_id || !user_id || !content)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            conversation = await Conversation.findByPk(conversation_id);
            if (!conversation)
                send_error(res, 404, "Conversation not found");
            else {
                user = await User.findByPk(user_id);
                if (!user)
                    send_error(res, 404, "User not found");
                else {
                    conversation_user = await ConversationUser.findOne({
                        where: {
                            conversation_id: conversation_id,
                            user_id: user_id
                        }
                    });
                    if (!conversation_user)
                        send_error(res, 404, "User not in conversation");
                    else {
                        message = await Message.create({
                            id: null,
                            content: content,
                            edition_date: new Date(),
                            creation_date: new Date(),
                            user_id: user.dataValues.id,
                            conversation_id: conversation.dataValues.id,
                        })
                        await message.save();
                        send_result(res, 201, message);
                    }
                }
            }
        }
        catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};

// DELETE /api/message/{id}
export const delete_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger("Delete message")
    try {
        if (!req.params.id)
            send_error(res, 400, "Missing parameters");
        else {
            const id: number = parseInt(req.params.id, 10);
            controller_logger.info("delete message " + id);
            const nb: number = await Message.destroy({where: {id: id}})

            if (nb === 0)
                send_error(res, 404, "Message not found");
            else
                send_success(res, 204);
        }
    }
    catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};

// GET /api/message/{id}
export const get_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger("Get Message")
    if (req.params.id)
        send_error(res, 400, "Missing parameters")
    else {
        try {
            const id = parseInt(req.params.id, 10);
            let message : Message | null;
            controller_logger.info("get message " + id);

            message = await Message.findByPk(id);
            if (!message)
                send_error(res, 404, "Message not found");
            else
                send_result(res, 200, message);
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};

// GET /api/message
export const get_messages = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("Get messages");
    try {
        const messages = await Message.findAll();
        send_result(res, 200, messages);
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
}

// PUT /api/message/{id}
// required body : content
export const modify_message = async (req: Request, res: Response) : Promise<void> => {
    controller_logger.info("Modify message");
    if (!req.params.id)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            const id: number = parseInt(req.params.id, 10);
            controller_logger.info("modifying message " + id);

            const { content } = req.body;
            let message : Message | null = await Message.findByPk(id);
            if (!message)
                send_error(res, 404, "Message not found");
            else {
                message.dataValues.content = content;
                await message.save();
                send_result(res, 200, message);
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};