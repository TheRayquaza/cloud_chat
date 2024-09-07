import {Request, Response} from "express";
import bcrypt from 'bcrypt';

import User from "../db/user";

import {validate_password, validate_username} from "../validators/register";

import { controller_logger } from "../logger";

import { send_error, send_result } from "../scripts/send";
import { createJwt } from "../scripts/jwt";

const saltRound = 10;

// POST /api/register
export const register = async (req: Request, res: Response) : Promise<void> => {
    const username: string = req.body.username,
          password: string = req.body.password;
    let token : string, hash : string, user : User | null;

    controller_logger.info("register a new user with name " + username);

    if (!username || !password)
        send_error(res, 400, "Both username and password are required");
    else if (!validate_username(username))
        send_error(res, 401, "Username did not meet expectations");
    else if (!validate_password(password))
        send_error(res, 401, "Password did not meet expectations");
    else {
        try {
            // Verify if user already exists
            user = await User.findOne({where: {username: username}});
            if (user)
                send_error(res, 409, "User already exists");
            else {
                // Create user and send token
                hash = await bcrypt.hash(password, saltRound);
                user = await User.create({ id: null,  username: username,  password_hash: hash, permission: 0, last_connection: new Date(), creation_date: new Date()});
                await user.save();
                token = await createJwt(user.dataValues.id as number, user.dataValues.username);
                send_result(res, 201, {token: token, username: user.dataValues.username, id: user.dataValues.id});
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Server error");
        }
    }
};