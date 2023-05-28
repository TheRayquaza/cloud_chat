import { Dispatch, SetStateAction } from "react";
import {List, ListItem} from "@chakra-ui/react";

import Message from "./Message";

import message from "../types/message";

type MessageProps = {
    messages: message[],
    setMessages : Dispatch<SetStateAction<message[]>>;
};

const Messages = (props : MessageProps) => {
    const { messages, setMessages } = props;

    return (
        <List flex={1} p="8px" overflowY="auto">
            {messages.map(message => (
                <ListItem key={message.id}>
                    <Message message={message} setMessages={setMessages}/>
                </ListItem>
            ))}
        </List>
    );
};

export default Messages;