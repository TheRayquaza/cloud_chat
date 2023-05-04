import { Request, Response } from "express";
const { controller_logger } = require("../logger");
const { send_error, send_result } = require("../scripts/send");
const { createJwt } = require("../scripts/jwt");
import bcrypt from "bcrypt";
import User from "../db/user";

export const login = (req: Request, res: Response): void => {
    controller_logger.info("login a user");
    const { username, password } = req.body;

    if (!username || !password)
        send_error(res, 400, "Username or password not provided");

    User.findOne({ where: { username: username } })
        .then((user) => {
            if (!user) {
                send_error(res, 401, `${username} does not exist`);
                return Promise.reject("user does not exist");
            }

            bcrypt.compare(password, user.dataValues.password_hash).then((success) => {
                if (!success) send_error(res, 401, "Password is invalid");
                else
                    createJwt(user.dataValues.id, user.dataValues.username, (token: string) => {
                        send_result(res, 200, { token: token });
                    });
            });
        })
        .catch((err) => {
            controller_logger.error(err);
            send_result(res, 500, "Server error");
        });
};