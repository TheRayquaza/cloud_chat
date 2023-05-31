

type message = {
    id: number | null;
    content: string;
    creation_date: string;
    edition_date: string;
    conversation_id: number | null;
    user_id: number | null;
}

export default message;