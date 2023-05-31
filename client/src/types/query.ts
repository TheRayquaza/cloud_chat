
export type query = {
    type : string,
    content : any,
    action : string,
    sender : string,
    recipient : string
}

export const transform_query = (request : any) : query => {
    return {
        type : request.type,
        content : request.content,
        action : request.action,
        sender : request.sender,
        recipient : request.recipient
    }
}