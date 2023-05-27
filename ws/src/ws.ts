import WebSocket from 'ws';
import { logger } from './logger';

// process.env
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

const wss = new WebSocket.Server({ port: parseInt(process.env.PORT as string, 10) }, () => {
    logger.info(`Server started on port ${process.env.PORT}`);
});
const users = new Map(); // connected users

wss.on('connection', (ws) => {
    logger.info('New connection');
    let id : string;

    ws.on('message', (message) => {
        logger.info(`Received message => ${message}`);
        const data = JSON.parse(message.toString());
        const { type, payload } = data;

        if (type === 'join') {
            // Handle user joining a conversation
            const { conversationId, username } = payload;
            id = generateUniqueId(); // Generate a unique user ID

            // Store the user ID with the WebSocket connection
            users.set(id, ws);

            // Broadcast the user joining to all connected clients
            broadcastMessage({
                type: 'join',
                payload: { id, username }
            });

            console.log(`User ${id} joined the conversation ${conversationId}`);
        } else if (type === 'message') {
            // Handle incoming messages
            const { conversationId, content } = payload;

            // Broadcast the message to all connected clients
            broadcastMessage({
                type: 'message',
                payload: {
                    id,
                    conversationId,
                    content
                }
            });

            console.log(`Received message from user ${id}: ${content}`);
        }
    });

    ws.on('close', () => {
        logger.info('Connection closed');
        // Handle WebSocket connection close
        users.delete(id);

        // Broadcast the user leaving to all connected clients
        broadcastMessage({
            type: 'leave',
            payload: { id }
        });

        console.log(`User ${id} left the conversation`);
    });
});

const broadcastMessage = (message : any) => {
    const serializedMessage = JSON.stringify(message);

    // Send the message to all connected clients
    users.forEach((client) => {
        client.send(serializedMessage);
    });
}

const generateUniqueId = () => {
    // Generate a unique ID (you can use your preferred method)
    return Math.random().toString(36).substr(2, 9);
}
