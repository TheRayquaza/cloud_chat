import { Request, Response } from "express";
import Conversation from "../db/conversation";
import ConversationUser from "../db/conversation_user";
import User from "../db/user";
import { controller_logger } from "../logger";
import { send_error, send_result, send_success } from "../scripts/send";

// POST /api/conversation
// required body : name, user_id
export const new_conversation = (req: Request, res: Response): void => {
    controller_logger.info("new conversation");
    const name : string = req.body.name;
    const users_id : Array<string> = req.body.users_id;
    Conversation.create({
        id : null,
        name: name,
        creation_date: new Date(),
        edition_date: new Date(),
    })
        .then((conversation_instance) => {
            conversation_instance.save();
            users_id.forEach((user_id : string) => {
                    return ConversationUser.create({
                        id : null,
                        user_id: parseInt(user_id, 10),
                        conversation_id: conversation_instance.dataValues.id,
                    }).then((conversation_user_instance) =>
                        conversation_user_instance.save()
                    );
                }
            );
            send_success(res);
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        });
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
    controller_logger.info("modifying conversation " + id);
    const name = req.body.name;
    Conversation.update(
        { name: name, edition_date: new Date() },
        { where: { id: id } }
    ).catch((err) => {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    });
}