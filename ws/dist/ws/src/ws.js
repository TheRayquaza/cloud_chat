"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const message_1 = require("./types/message");
const conversation_1 = require("./types/conversation");
const user_1 = require("./types/user");
const query_1 = require("./types/query");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const wss = new ws_1.default.Server({ port: parseInt(process.env.PORT, 10), host: process.env.HOST });
const record = []; // list of all users, conversations and messages
const clients = [];
console.log(`-> WebSocket server listening on ${process.env.HOST}:${process.env.PORT}.`);
const send_ws = (client, content, type, action = "default") => {
    client.send(JSON.stringify({
        type: type,
        content: JSON.stringify(content),
        action: action,
        sender: "server",
        recipient: "client",
    }));
};
const auth_handler = (ws, query) => {
    console.log(query);
    const user = (0, user_1.transform_user)(query.content);
    record.push({
        user: user,
        conversation: { id: null, edition_date: new Date(), creation_date: new Date(), name: "", admin_id: -1 },
        messages: []
    });
    clients.push(ws);
    logger_1.default.info(`User ${user.username} authenticated.`);
};
const message_handler = (ws, query) => {
    const message = (0, message_1.transform_message)(query.content);
    const user = query.user;
    if (query.action === "deleted") {
        logger_1.default.info(`Message ${message.id} deleted.`);
        // Remove message from current messages
        for (let i = 0; i < record.length; i++)
            if (record[i].user.id === user.id && record[i].conversation.id === message.conversation_id)
                record[i].messages.splice(record[i].messages.indexOf(message), 1);
        // Send notification deleted message to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === message.conversation_id && record[i].user.id !== message.user_id && clients[i].OPEN == ws_1.default.OPEN)
                send_ws(clients[i], message, "message", "deleted");
    }
    else if (query.action === "updated") {
        logger_1.default.info(`Message ${message.id} updated.`);
        // Update message from current messages
        for (let i = 0; i < record.length; i++)
            if (record[i].user.id === message.user_id && record[i].conversation.id === message.conversation_id)
                for (let j = 0; j < record[i].messages.length; j++)
                    record[i].messages[j] = message;
        // Send notification updated message to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === message.conversation_id && record[i].user.id !== message.user_id && clients[i].OPEN == ws_1.default.OPEN)
                send_ws(clients[i], message, "message", "updated");
    }
    else if (query.action === "created") {
        logger_1.default.info(`Message ${message.id} created.`);
        // Add message to current messages
        for (let i = 0; i < record.length; i++)
            if (record[i].user.id === message.user_id && record[i].conversation.id === message.conversation_id)
                record[i].messages.push(message);
        // Send notification created message to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === message.conversation_id && record[i].user.id !== message.user_id)
                send_ws(clients[i], message, "message", "created");
    }
};
const conversation_handler = (ws, query) => {
    const conversation = (0, conversation_1.transform_conversation)(query.content);
    const user = query.user;
    if (query.action === "created") {
        logger_1.default.info(`Conversation ${query.content.id} created.`);
        // Send notification created conversation to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && clients[i].OPEN == ws_1.default.OPEN)
                send_ws(clients[i], conversation, "conversation", "created");
        // Update conversation from current conversations
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && record[i].user.id == user.id)
                record[i].conversation = conversation;
    }
    else if (query.action === "updated") {
        logger_1.default.info(`Conversation ${query.content.id} updated.`);
        // Send notification updated conversation to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && clients[i].OPEN == ws_1.default.OPEN)
                send_ws(clients[i], conversation, "conversation", "updated");
        // Update conversation from current conversations
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && record[i].user.id == user.id)
                record[i].messages = [];
    }
    else if (query.action === "deleted") {
        logger_1.default.info(`Conversation ${query.content.id} deleted.`);
        // Send notification deleted conversation to all clients
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && clients[i].OPEN == ws_1.default.OPEN)
                send_ws(clients[i], conversation, "conversation", "deleted");
        // Update conversation from current conversations
        for (let i = 0; i < record.length; i++)
            if (record[i].conversation.id === conversation.id && record[i].user.id == user.id)
                record[i].messages = [];
    }
};
const user_handler = (ws, query) => {
    switch (query.action) {
        case "created":
        case "updated":
        case "deleted":
        case "default":
            console.log(query);
    }
};
wss.on('connection', (ws) => {
    logger_1.default.info('WebSocket connection established.');
    ws.on('message', (message) => {
        const receivedMessage = JSON.parse(message.toString());
        logger_1.default.info(`Received message: ${receivedMessage}`);
        const query = (0, query_1.transform_query)(message.toString());
        if (receivedMessage.type === "auth")
            auth_handler(ws, query);
        else if (receivedMessage.type === 'message')
            message_handler(ws, query);
        else if (receivedMessage.type === 'conversation')
            conversation_handler(ws, query);
        else if (receivedMessage.type === 'user')
            user_handler(ws, query);
    });
    ws.on('close', () => console.log('WebSocket connection closed.'));
    ws.on('error', (error) => console.error('WebSocket error:', error));
});
//# sourceMappingURL=ws.js.map