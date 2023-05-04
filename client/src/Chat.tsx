import React, {useState} from 'react';
import {Paper, TextField, Typography} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Chat = () => {
    const [messages] = useState([]);
    const [input, setInput] = useState('');

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSend = () => {
        /*const newMessage = {
            position: "right",
            type: "text",
            text: input,
            date: new Date(),
        };
        //setMessages(() => newMessage); // TODO THIS IS WRONG
         */
        setInput("");
    };

    return (
        <Paper>
            <div>
                <ChatBubbleOutlineIcon/>
                <Typography variant="h6">Chat</Typography>
            </div>
            <div>
                {messages.map((message, index) => (
                    <Typography
                        key={index}
                        variant="body1"
                        gutterBottom
                    >
                        {message}
                    </Typography>
                ))}
            </div>
            <form onSubmit={handleSend}>
                <TextField
                    fullWidth
                    placeholder="Type a message"
                    value={input}
                    onChange={handleInput}
                />
            </form>
        </Paper>
    );
};

export default Chat;
