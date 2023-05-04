import { Request, Response } from "express";
import Message from "../db/message";
import Conversation from "../db/conversation";
import User from "../db/user";
const { controller_logger } = require("../logger");
const { send_error, send_result, send_success } = require("../scripts/send");

// POST /api/message
// required body : content, user_id, conversation_id
export const new_message = (req: Request, res: Response) => {
    controller_logger.info("new message");
    const { conversation_id, user_id, content } = req.body;

    Conversation.findByPk(conversation_id)
    .then((conversation_instance) => {
        if (!conversation_instance)
            send_error(res, 404, "Conversation associated not found");
        else
            User.findByPk(user_id).then((user_instance) => {
                if (!user_instance)
                    send_error(res, 404, "User associated not found");
                else
                    Message.create({
                        id : null,
                        content: content,
                        edition_date: new Date(),
                        creation_date: new Date(),
                        user_id: user_instance.dataValues.id,
                        conversation_id: conversation_instance.dataValues.id,
                    })
                    .then(message_instance => message_instance.save())
                    .then(message_instance => send_success(res))
            });
    })
    .catch((err) => {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    });
};

// DELETE /api/message/{id}
export const delete_message = (req: Request, res: Response) => {
    const id = req.params.id;
    controller_logger.info("delete message " + id);
    Message.destroy({ where: { id: id } })
        .then((nb) => {
            if (nb === 0) send_error(res, 404, "Message not Found");
            else send_success(res);
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        });
};

// GET /api/message/{id}
export const get_message = (req: Request, res: Response) => {
    const id = req.params.id;
    controller_logger.info("get message " + id);
    Message.findByPk(id)
    .then((message) => {
        if (!message) send_error(res, 404, "Message not Found");
        else send_result(res, 200, message);
    })
    .catch((err) => {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    });
};

// PUT /api/message/{id}
// required body : content
export const modify_message = (req: Request, res: Response) => {
    const id = req.params.id;
    controller_logger.info("modifying message " + id);
    const content = req.body.content;
    Message.update(
        { content: content, edition_date: new Date() },
        { where: { id: id } }
    )
    .catch((err) => {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    });
};
