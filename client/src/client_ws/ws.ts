const ws = new WebSocket('ws://localhost:8081');

ws.addEventListener('open', () => {
    console.log('WebSocket connection opened');

    // User joins the conversation
    const joinMessage = {
        type: 'join',
        payload: {
            conversationId: 'CONVERSATION_ID', // Replace with the actual conversation ID
            username: 'John' // Replace with the actual username
        }
    };
    ws.send(JSON.stringify(joinMessage));
});

ws.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    const { type, payload } = data;

    if (type === 'join') {
        // Handle user joining the conversation
        const { userId, username } = payload;
        console.log(`User ${userId} (${username}) joined the conversation`);
    } else if (type === 'message') {
        // Handle incoming messages
        const { userId, conversationId, content } = payload;
        console.log(`Received message from user ${userId} in conversation ${conversationId}: ${content}`);
    } else if (type === 'leave') {
        // Handle user leaving the conversation
        const { userId } = payload;
        console.log(`User ${userId} left the conversation`);
    }
});

ws.addEventListener('close', () => {
    console.log('WebSocket connection closed');
});

export default ws;