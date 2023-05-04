import {Request, Response} from "express";
import {validate_password, validate_username} from "../validators/register";
import User from "../db/user";
import bcrypt from 'bcrypt';

const { controller_logger } = require("../logger");
const { send_error, send_result } = require("../scripts/send");
const { createJwt } = require("../scripts/jwt");

const saltRound = 10;

// POST /api/register
export const register = (req: Request, res: Response) => {
    controller_logger.info("register a new user");

    const username: string = req.body.username;
    const password: string = req.body.password;

    if (!username || !password)
        send_error(res, 400, "Both username and password are required");
    else if (!validate_username(username))
        send_error(res, 401, "Username did not meet expectations");
    else if (!validate_password(password))
        send_error(res, 401, "Password did not meet expectations");

    User.findOne({ where: { username: username } })
    .then(user => {
        if (user) {
            send_error(res, 409, "User already exists");
            return Promise.reject("user already exists");
        }
        return bcrypt.hash(password, saltRound);
    })
    .then(hash => User.create({id : null, username: username, password_hash: hash, permission: 0, last_connection : new Date(), creation_date : new Date()}))
    .then(instance => instance.save())
    .then(() => User.findOne({ where: { username: username } }))
    .then(user => {
        if (!user)
        {
            send_error(res, 500, "Unable to register the new user");
            return Promise.reject("Unable to register");
        }
        else
            createJwt(user.dataValues.id, user.dataValues.username, (encoded : string) => {
                send_result(res, {token: encoded, username: user.dataValues.username})
            });
    })
    .catch(err => {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    });
};