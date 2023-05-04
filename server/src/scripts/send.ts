import { Response } from "express";

export const send_error = (res: Response, status: number, msg: string): void => {
    res.status(status).json({status: status, error : msg})
}

export const send_result = (res: Response, status: number, content: object): void => {
    res.status(status).json(content)
}

export const send_success = (res: Response): void => {
    res.status(200).json({"success": true})
}
