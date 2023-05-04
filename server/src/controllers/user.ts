import { Request, Response } from "express";
import User from "../db/user";
const { controller_logger } = require("../logger");
const { send_error, send_result, send_success } = require("../scripts/send");
import bcrypt from 'bcrypt';

const saltRound = 10;

// GET /api/user/{id}
export const get_user = (req: Request, res: Response): void => {
    controller_logger.info("get user");
    const id = req.params.id;

    if (!id) {
        res.status(400).json({ "error": "bad request, missing id query" });
        return;
    }

    User.findByPk(id)
        .then((user) => {
            if (!user) {
                controller_logger.info("unable to get user with id " + id);
                send_error(res, 404, "Unable to get the user " + id);
            }
            else {
                send_result(res, user);
            }
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Unable to access the db");
        });
};

// GET /api/user
export const get_all_user = (req: Request, res: Response): void => {
    controller_logger.info("get all user");
    User.findAll()
        .then((users) => {
            if (!users) {
                controller_logger.info("unable to get all users");
                send_error(res, 404, "Unable to get all users");
            }
            else {
                send_result(res, users);
            }
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Unable to access the db");
        });
};

// DELETE /api/user/{id}
export const delete_user = (req: Request, res: Response): void => {
    controller_logger.info("delete user");
    const id = req.params.id;

    if (!id) {
        send_error(res, 400, "Bad request, missing id query");
        return;
    }

    User.destroy({ where: { id: id } })
        .then((nb) => {
            if (nb === 0) {
                controller_logger.info("unable to delete user with id " + id);
                send_error(res, 404, "user " + id + " not found");
            }
            else {
                send_success(res);
            }
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Unable to access the db");
        });
};

// POST /api/user
// required in req.body : username, password 
export const post_user = (req: Request, res: Response): void => {
    controller_logger.info("post a new user");

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        send_error(res, 400, "Bad request, username and password required");
        return;
    }

    bcrypt.hash(password, saltRound)
        .then((hash) => User.create({ id: null, username: username, password_hash: hash, permission: 0, last_connection : new Date(), creation_date : new Date()}))
        .then((instance) => instance.save())
        .then(() => send_success(res))
        .catch((error) => {
            controller_logger.error(error);
            send_error(res, 500, "Unable to access the db");
        });
};

