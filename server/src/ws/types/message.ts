

export type message = {
    id: number | null;
    content: string;
    creation_date: Date;
    edition_date: Date;
    conversation_id: number | null;
    user_id: number | null;
}

export const transform_message = (message : any) : message => {
    return {
        id : message.id,
        content : message.content,
        creation_date : message.creation_date,
        edition_date : message.edition_date,
        conversation_id : message.conversation_id,
        user_id : message.user_id
    }
}

export default message;