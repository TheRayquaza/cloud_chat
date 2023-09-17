import message from "./message";
import user from "./user";
import conversation from "./conversation";

export type record = {
    user : user,
    conversation : conversation,
    messages : message[]
}