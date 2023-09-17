import { middleware_logger }  from "../logger"
import  { verifyJwt } from "../scripts/jwt"
import { send_error } from "../scripts/send"
import {Response, NextFunction, Request} from "express"
import {TokenPayload} from "../scripts/jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    middleware_logger.info("authentification");
    const token :string | undefined = req.headers.authorization?.split(" ")[1];

    if (!token)
        send_error(res, 401, 'No token provided');
    else {
        // Verify JWT and extract user data
        try {
            const decoded: TokenPayload = await verifyJwt(token);
            if (!decoded)
                send_error(res, 401, 'Invalid token');
            else {
                req.headers["X-id"] = decoded.id.toString();
                req.headers["X-username"] = decoded.username;
                next();
            }
        }
        catch (err) {
            middleware_logger.error(err);
            send_error(res, 401, 'Invalid token');
        }
    }
}