import conversation from "../types/conversation.ts";
import message from "../types/message.ts";

export const transformToMessage = (input: any): message => {
    // Check if the input object has the required properties
    if (
        typeof input.conversation_id === 'number' ||
        input.conversation_id === null ||
        typeof input.content === 'string' ||
        typeof input.creation_date === 'string' ||
        input.creation_date instanceof Date ||
        typeof input.edition_date === 'string' ||
        input.edition_date instanceof Date ||
        typeof input.id === 'number' ||
        input.id === null ||
        typeof input.user_id === 'number' ||
        input.user_id === null
    ) {
        // Create a new message object and assign the values from the input object
        return {
            conversation_id: input.conversation_id,
            content: input.content,
            creation_date: new Date(input.creation_date),
            edition_date: new Date(input.edition_date),
            id: input.id,
            user_id: input.user_id,
        }
    } else
        return { id: null, content: '', creation_date: new Date(), edition_date: new Date(), conversation_id: null, user_id: null };
}

export const transformToMessages = (input: any): message[] => {
    if (Array.isArray(input))
        return input.map((conversation: any) => transformToMessage(conversation));
    else
        return [];
}

export const transformToConversation = (input: any): conversation => {
    // Check if the input object has the required properties
    if (
        typeof input.admin_id === 'number' ||
        input.admin_id === null ||
        typeof input.id === 'number' ||
        input.id === null ||
        typeof input.name === 'string' ||
        input.creation_date instanceof Date ||
        input.edition_date instanceof Date
    ) {
        // Create a new conversation object and assign the values from the input object
        return {
            admin_id: input.admin_id,
            id: input.id,
            name: input.name,
            creation_date: new Date(input.creation_date),
            edition_date: new Date(input.edition_date),
        };
    } else {
        throw new Error('Invalid input object. Cannot transform to conversation.');
    }
}

export const transformToConversations = (input: any): conversation[] => {
    // Check if the input object has the required properties
    if (Array.isArray(input)) {
        // Create a new conversation object and assign the values from the input object
        return input.map((conversation: any) => {
            return transformToConversation(conversation);
        });
    } else {
        return [];
    }
}
