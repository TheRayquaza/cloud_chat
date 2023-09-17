
export type conversation = {
    admin_id : number | null;
    id: number | null;
    name: string;
    creation_date: Date;
    edition_date: Date;
}

export const transform_conversation = (conversation : any) : conversation => {
    return {
        admin_id : conversation.admin_id,
        id : conversation.id,
        name : conversation.name,
        creation_date : conversation.creation_date,
        edition_date : conversation.edition_date
    }
}

export default conversation;