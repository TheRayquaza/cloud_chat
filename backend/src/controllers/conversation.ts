import { Request, Response } from "express";

import Conversation from "../db/conversation";
import ConversationUser from "../db/conversation_user";
import User from "../db/user";

import {controller_logger, middleware_logger} from "../logger";
import { send_error, send_result, send_success } from "../scripts/send";

import { validate_user_id } from "../validators/user";

// POST /api/conversation
// required body : name, user_id
export const new_conversation = async (req: Request, res: Response): Promise<void> => {
    controller_logger.info("new conversation");

    const {name, users_id} = req.body;
    const admin_id : number = parseInt(req.headers["X-id"] as string);

    let conversation : Conversation, user : User | null, conversation_user : ConversationUser | null,
        user_instances : Array<User> = [], not_found : boolean = false;

    if (!name || !users_id)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            for (let i : number = 0; i < users_id.length; i++) {
                if (!await validate_user_id(users_id[i])) {
                    middleware_logger.info("user " + users_id[i] + " does not exist");
                    not_found = true;
                    break;
                }
            }
            if (not_found)
                send_error(res, 404, "One or multiple users do not exist");
            else {
                // Create conversation
                conversation = await Conversation.create({ name: name, admin_id: admin_id, id : null, creation_date : new Date(), edition_date : new Date()});
                for (let i : number = 0; i < users_id.length; i++)
                    await conversation.add_user(users_id[i]);
                await conversation.add_user(admin_id);
                await conversation.save();
                send_result(res, 201, conversation);
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};

// DELETE /api/conversation/{id}
export const delete_conversation = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const user_id = parseInt(req.headers["X-id"] as string);
    controller_logger.info("delete conversation " + id);

    try {
        // Find the conversation
        const conversation: Conversation | null = await Conversation.findByPk(id);
        if (!conversation)
            send_error(res, 404, "Conversation not found");
        else if (conversation.dataValues.admin_id != user_id)
            send_error(res, 401, "Unauthorized");
        else {
            await conversation.delete();
            send_success(res);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};

// DELETE /api/conversation/{id}/leave
export const leave_conversation = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const user_id : number = parseInt(req.headers["X-id"] as string);
    controller_logger.info("user " + user_id + " leaves conversation " + id);

    try {
        // Find the conversation
        const conversation: Conversation | null = await Conversation.findByPk(id);
        if (!conversation)
            send_error(res, 404, "Conversation not found");
        else {
            await conversation.remove_user(user_id);
            send_success(res);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
}

// GET /api/conversation/{id}
export const get_conversation = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    controller_logger.info("get conversation " + id);

    try {
        const conversation: Conversation | null = await Conversation.findByPk(id);
        if (!conversation)
            send_error(res, 404, "Conversation not found");
        else {
            send_result(res, 200, conversation);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};

// PUT /api/conversation/{id}
// required body : name
export const modify_conversation = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { name, removed_users, added_users } = req.body;
    controller_logger.info("modifying conversation " + id);

    if (!name)
        send_error(res, 400, "Missing parameters");
    else {
        try {
            const conversation: Conversation | null = await Conversation.findByPk(id);
            if (!conversation)
                send_error(res, 404, "Conversation not found");
            else {
                conversation.setDataValue("name", name);
                conversation.setDataValue("edition_date", new Date());

                if (removed_users)
                    for (let i: number = 0; i < removed_users.length; i++)
                        await conversation.remove_user(removed_users[i]);
                if (added_users)
                    for (let i: number = 0; i < added_users.length; i++)
                        await conversation.add_user(added_users[i]);

                await conversation.save();
                send_success(res);
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
}

// GET /api/conversation/{id}/message
export const get_conversation_messages = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    controller_logger.info("get conversation " + id + " messages");

    try {
        const conversation: Conversation | null = await Conversation.findByPk(id);
        if (!conversation)
            send_error(res, 404, "Conversation not found");
        else {
            const messages = await conversation.get_messages();
            send_result(res, 200, messages);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
}

// GET /api/conversation/{id}/user
export const get_conversation_users = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    controller_logger.info("get conversation " + id + " users");

    try {
        const conversation: Conversation | null = await Conversation.findByPk(id);
        if (!conversation)
            send_error(res, 404, "Conversation not found");
        else {
            const users = await conversation.get_users();
            const users_filtered = users.map((user: User) => {
                return {
                    username: user.dataValues.username,
                    permission: user.dataValues.permission,
                    last_connection: user.dataValues.last_connection,
                    creation_date: user.dataValues.creation_date
                }
            });
            send_result(res, 200, users_filtered);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
}