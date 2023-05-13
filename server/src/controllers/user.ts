import {Request, Response} from "express";
import bcrypt from 'bcrypt';
import User from "../db/user";
import {controller_logger} from "../logger";
import {send_error, send_result, send_success} from "../scripts/send";
import {validate_password, validate_username} from "../validators/register";

const saltRound = 10;

// GET /api/user/{id}
export const get_user = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    let user: User | null;

    controller_logger.info("Get user " + id);

    if (!id)
        send_error(res, 400, "Missing id query");
    else {
        try {
            user = await User.findByPk(id, { attributes: { exclude: ['password_hash'] } });
            if (!user) {
                controller_logger.info("Unable to get user with id " + id);
                send_error(res, 404, "Unable to get the user " + id);
            } else
                send_result(res, 200, user);
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Unable to access the db");
        }
    }
};

// GET /api/user
export const get_all_user = async (req: Request, res: Response): Promise<void> => {
    controller_logger.info("Get all user");

    try {
        const users : User[] = await User.findAll({ attributes: { exclude: ['password_hash'] }});
        if (!users) {
            controller_logger.info("Unable to get all users");
            send_error(res, 404, "Unable to get all users");
        } else
            send_result(res, 200, users);
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Unable to access the db");
    }
};

// DELETE /api/user/{id}
export const delete_user = async (req: Request, res: Response): Promise<void> => {
    controller_logger.info("Delete user");

    try {
        if (!req.params.id)
            send_error(res, 400, "Missing id query");
        else {
            const id : number = parseInt(req.params.id, 10);
            const nb: number = await User.destroy({where: {id: id}});
            if (nb == 0) {
                controller_logger.info("Unable to delete user with id " + id);
                send_error(res, 404, "Unable to find user " + id);
            } else
                send_success(res);
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};

// POST /api/user
// required in req.body : username, password 
export const post_user = async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;
    let user : User | null, hash : string;
    controller_logger.info("Post a new user with username " + username);

    if (!username || !password)
        send_error(res, 400, "Username and password required");
    else if (!validate_password(password))
        send_error(res, 400, "Password does not meet expectations");
    else if (!validate_username(username))
        send_error(res, 400, "Username does not meet expectations");
    else {
        try {
            user = await User.findOne({where: {username: username}});
            if (user)
                send_error(res, 400, "Username already taken");
            else {
                hash = await bcrypt.hash(password, saltRound);
                user = await User.create({
                    id: null,
                    username: username,
                    password_hash: hash,
                    permission: 0,
                    last_connection: new Date(),
                    creation_date: new Date()
                });
                await user.save();
                send_result(res, 201, {
                    id: user.dataValues.id,
                    username: user.dataValues.username,
                    permission: user.dataValues.permission,
                    last_connection: user.dataValues.last_connection,
                    creation_date: user.dataValues.creation_date
                });
            }
        } catch (err) {
            controller_logger.error(err);
            send_error(res, 500, "Unable to access the db");
        }
    }
};

// PUT /api/user/{id}
// optional in req.body : username, password
export const put_user = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_modified: number = parseInt(req.params.id, 10),
            id : number = parseInt(req.headers["X-id"] as string, 10);

        const user: User | null = await User.findByPk(id),
            user_modified: User | null = await User.findByPk(id_modified);

        const {username, password, permission} = req.body;
        let no_error : boolean = true;

        controller_logger.info("Put user " + id)

        if (!user_modified || !user)
            send_error(res, 404, "User not found");
        else if (user_modified.dataValues.permission >= user.dataValues.permission)
            send_error(res, 403, "Unable to update this user");
        else {
            const update_values: any = {};

            if (permission && no_error) {
                if (user.dataValues.permission > user_modified.dataValues.permission)
                    update_values["permission"] = permission;
                else {
                    no_error = false;
                    send_error(res, 400, "Unable to change the permission of this user");
                }
            }
            if (password) {
                if (validate_password(password))
                    update_values["password_hash"] = await bcrypt.hash(password, saltRound);
                else {
                    no_error = false;
                    send_error(res, 400, "Password does not meet expectations");
                }
            }
            if (username && no_error) {
                if (validate_username(username)) {
                    let any_user : User | null = await User.findOne({where: {username: username}});
                    if (!any_user)
                        update_values["username"] = username;
                    else {
                        no_error = false;
                        send_error(res, 400, "Username already taken");
                    }
                }
                else {
                    no_error = false;
                    send_error(res, 400, "Username does not meet expectations");
                }
            }

            if (no_error) {
                await user_modified.update(update_values);
                await user_modified.save();
                send_success(res);
            }
        }
    } catch (err) {
        controller_logger.error(err);
        send_error(res, 500, "Server error");
    }
};