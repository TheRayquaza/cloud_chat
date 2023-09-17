import { Request, Response } from "express";
import { controller_logger } from "../logger";
import { send_error, send_result } from "../scripts/send";
import { createJwt }  from "../scripts/jwt";
import bcrypt from "bcrypt";
import User from "../../../db/models/user";

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    let user : User | null, token : string, success : boolean;

    controller_logger.info("trying to login " + username);

    if (!username || !password)
        send_error(res, 400, "Username or password not provided");
    else {
        try {
            user = await User.findOne({where: {username: username}});
            if (!user)
                send_error(res, 401, `${username} does not exist`);
            else {
                success = await bcrypt.compare(password, user.dataValues.password_hash);
                if (!success)
                    send_error(res, 401, "Password is invalid");
                else {
                    token = await createJwt(user.dataValues.id as number, user.dataValues.username);
                    send_result(res, 200, {
                        token: token,
                        username: user.dataValues.username,
                        id: user.dataValues.id
                    });
                }
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server Error");
        }
    }
};