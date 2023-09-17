import user from "./user";

export type query = {
    type : string,
    content : any,
    user : user | null,
    action : string,
    sender : string,
    recipient : string
}

export const transform_query = (request : any) : query => {
    if (request.type === "auth")
        return {
            type : request.type,
            content : JSON.parse(request.content),
            user : null,
            action : request.action,
            sender : request.sender,
            recipient : request.recipient
        }
    return {
        type : request.type,
        content : JSON.parse(request.content),
        user : JSON.parse(request.user),
        action : request.action,
        sender : request.sender,
        recipient : request.recipient
    }
}

export default query;