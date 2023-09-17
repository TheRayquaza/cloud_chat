import {Response} from "express";
import {script_logger} from "../logger";


export const send_error = (res: Response, status: number, msg: string): void => {
    script_logger.info("final response : " + msg);
    res.status(status).json({status: status, error : msg});
}

export const send_result = (res: Response, status: number, content: object): void => {
    script_logger.info("finale response : result sent with content \n" + JSON.stringify(content, null, 2) + "\n");
    res.status(status).json(content);
}

export const send_success = (res: Response, status : number = 200): void => {
    script_logger.info("final response : request done with success");
    res.status(status).json({status : status, success: true});
}