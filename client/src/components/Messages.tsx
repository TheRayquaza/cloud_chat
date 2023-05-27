import { Box } from "@chakra-ui/react";
import Message from "./Message";

type MessageProps = {
    messages: Array<any>
};

const Messages = (props : MessageProps) => {
    const { messages } = props;

    return (
        <Box flex={1} p="8px" overflowY="auto">
            {messages.map(message => (
                <Message message={message}/>
            ))}
        </Box>
    );
};

export default Messages;