import { user } from "../types/user.ts";

export const socket = new WebSocket('ws://loqui-chat.xyz/socket.io');

socket.onopen = () => console.log('WebSocket connection established.');
socket.onclose = () => console.log('WebSocket connection closed.');
socket.onerror = (error) => console.error('WebSocket error:', error);

// Function to send a chat message to the server
export const send_ws = (content : any, type : string, action : string = "default", user : user | null = null) => {
    if (user)
        socket.send(JSON.stringify( {
            type: type,
            content : JSON.stringify(content),
            user : JSON.stringify(user),
            action : action,
            sender : "client",
            recipient : "server",
        }));
    else
        socket.send(JSON.stringify( {
            type: type,
            content : JSON.stringify(content),
            action : action,
            sender : "client",
            recipient : "server",
        }));
};