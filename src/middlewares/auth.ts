import { middleware_logger } from "../logger"
import { verifyJwt } from "../scripts/jwt"
import { send_error } from "../scripts/send"
import { Request, Response, NextFunction } from "express"

const auth = (req: Request, res: Response, next: NextFunction) => {
    middleware_logger.info("authentification")
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) send_error(res, 401, 'No token provided')
    else {
        // Verify JWT and extract user data
        verifyJwt(token, decoded => {
            if (!decoded) send_error(res, 401, 'Invalid token')
            else {
                req.id = decoded.id
                req.body = decoded.username
                // call next middleware
                next()
            }
        })
    }
}

export default auth;
