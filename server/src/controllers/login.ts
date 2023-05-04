import { Request, Response } from "express";
import { controller_logger } from "../logger";
import { send_error, send_result } from "../scripts/send";
import { createJwt }  from "../scripts/jwt";
import bcrypt from "bcrypt";
import User from "../db/user";

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body;
    controller_logger.info("trying login " + username);

    if (!username || !password)
        send_error(res, 400, "Username or password not provided");
    else
        User.findOne({ where: { username: username } })
        .then((user) => {
            if (!user) {
                send_error(res, 401, `${username} does not exist`);
                return Promise.reject("user does not exist");
            }
            else
                bcrypt.compare(password, user.dataValues.password_hash).then((success) => {
                    if (!success) send_error(res, 401, "Password is invalid");
                    else
                        createJwt(user.dataValues.id as number, user.dataValues.username, (token?: string) => {
                            send_result(res, 200, { token: token });
                        });
                });
        })
        .catch((err) => {
            controller_logger.error(err);
            send_error(res, 500, "Server Error");
        });
};