import WebSocket from 'ws';

import { message, transform_message } from "./types/message";
import { conversation, transform_conversation } from "./types/conversation";
import { user, transform_user } from "./types/user";
import { query, transform_query } from "./types/query";
import { record } from "./types/record";

import dotenv from 'dotenv';
import logger from "./logger";

dotenv.config();

const wss = new WebSocket.Server({ port: parseInt(process.env.PORT as string, 10), host : process.env.HOST });
const record : Array<record> = []; // list of all users, conversations and messages
const clients : WebSocket.WebSocket[] = []

console.log(`-> WebSocket server listening on ${process.env.HOST}:${process.env.PORT}.`);

const send_ws = (client : WebSocket.WebSocket, content : any, type : string, action : string = "default") => {
    const msg = JSON.stringify(
        {
            type : type,
            content : content,
            action : action,
            sender : "server",
            recipient : "client",
        }
    )
    logger.info("Sending message to client: " + msg);
    client.send(msg);
}

const auth_handler = (ws : WebSocket.WebSocket, query : query) => {
    const user : user = transform_user(query.content);
    var stop = false;
    for (let i = 0; i < record.length; i++)
        if (record[i].user.id === user.id) {
            stop = true;
            break;
        }
    if (!stop) {
        record.push({
            user: user,
            conversation: {id: null, edition_date: new Date(), creation_date: new Date(), name: "", admin_id: -1},
            messages: []
        });
        clients.push(ws);
    }
    logger.info(`User ${user.username} authenticated.`);
}

const logout_handler = (ws : WebSocket.WebSocket, query : query) => {
    const user : user = transform_user(query.content);
    for (let i = 0; i < record.length; i++)
        if (record[i].user.id === user.id) {
            record.splice(i, 1);
            clients.splice(i, 1);
            break;
        }
    logger.info(`User ${user.username} logout.`);
}

const message_handler = (ws : WebSocket.WebSocket, query : query) => {
    const message: message = transform_message(query.content);
    const user: user = query.user as user;

    if (query.action === "deleted") {
        logger.info(`Message ${message.id} deleted.`);
        // Remove message from current messages
        for (let i = 0; i < record.length; i++)
            if (record[i].user.id === user.id && record[i].conversation.id === message.conversation_id) {
                record[i].messages.splice(record[i].messages.indexOf(message), 1);
                break;
            }
        // Send notification deleted message to all clients
        for (let i = 0; i < record.length; i++) {
            if (record[i].conversation.id === message.conversation_id && record[i].user.id !== user.id && clients[i].readyState == WebSocket.OPEN)
                send_ws(clients[i], message, "message", "deleted");
        }
    } else if (query.action === "updated") {
        logger.info(`Message ${message.id} updated.`);
        // Update message from current messages
        for (let i = 0; i < record.length; i++)
            if (record[i].user.id === user.id && record[i].conversation.id === message.conversation_id)
                for (let j = 0; j < record[i].messages.length; j++)
                    if (record[i].messages[j].id === message.id) {
                        record[i].messages[j] = message;
                        break;
                    }
        // Send notification updated message to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === message.conversation_id && record[i].user.id !== user.id && clients[i].readyState == WebSocket.OPEN)
                send_ws(clients[i], message, "message", "updated");
    } else if (query.action === "created") {
        logger.info(`Message ${message.id} created.`);
        // Add message to current messages
        for (let i = 0; i < record.length; i++)
            if (record[i].user.id === message.user_id && record[i].conversation.id === message.conversation_id) {
                record[i].messages.push(message);
                break;
            }
        // Send notification created message to all clients
        for (let i = 0; i < record.length; i++) {
            if (record[i].conversation.id === message.conversation_id && record[i].user.id !== user.id && clients[i].readyState == WebSocket.OPEN)
                send_ws(clients[i], message, "message", "created");
        }
    }
}

const conversation_handler = (ws : WebSocket.WebSocket, query : query) => {
    const conversation : conversation = transform_conversation(query.content);
    console.log(conversation);
    const user : user = query.user as user;

    if (query.action === "created") {
        logger.info(`Conversation ${conversation.id} created.`)
        // Update conversation from current conversations
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && record[i].user.id == user.id) {
                record[i].conversation = conversation;
                break;
            }
        // Send notification created conversation to all clients
        for (let i = 0; i < record.length; i++)
            if (clients[i].readyState == WebSocket.OPEN)  // TODO: check condition
                send_ws(clients[i], conversation, "conversation", "created");
    } else if (query.action === "updated") {
        logger.info(`Conversation ${conversation.id} updated.`);
        // Update conversation from current conversations
        for (let i = 0; i < record.length; i++) {
            if (record[i].user.id == user.id) {
                record[i].messages = []; // TODO : retrieve last messages of conversation on API
                record[i].conversation = conversation;
                break;
            }
        }
        console.log(record);
    } else if (query.action === "deleted") {
        logger.info(`Conversation ${conversation.id} deleted.`);
        // Send notification deleted conversation to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && clients[i].readyState == WebSocket.OPEN) // TODO: check conditions
                send_ws(clients[i], conversation, "conversation", "deleted");
        // Update conversation from current conversations
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && record[i].user.id == user.id) {
                record[i].messages = [];
                break;
            }
    }
}

wss.on('connection', (ws : WebSocket.WebSocket) => {
    logger.info('WebSocket connection established.');

    send_ws(ws, null, "default", "connected");

    ws.on('message', (message : WebSocket.RawData) => {
        const receivedMessage : any = JSON.parse(message.toString());
        logger.info(`Received message: ${message.toString()}`);
        const query = transform_query(receivedMessage);

        if (receivedMessage.type === "auth")
            auth_handler(ws, query);
        else if (receivedMessage.type === "logout")
            logout_handler(ws, query)
        else if (receivedMessage.type === 'message')
            message_handler(ws, query);
        else if (receivedMessage.type === 'conversation')
            conversation_handler(ws, query);
    });

    ws.on('close', () => console.log('WebSocket connection closed.'));
    ws.on('error', (error) => console.error('WebSocket error:', error));
});
