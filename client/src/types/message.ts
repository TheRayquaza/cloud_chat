

type message = {
    id: number | null;
    content: string;
    creation_date: Date;
    edition_date: Date;
    conversation_id: number | null;
    user_id: number | null;
}

export default message;