import {useState, useContext, useEffect, FormEvent} from "react";
import { toast } from "react-toastify";

import { Text, Box, Button, Input, Stack } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import CreateConversationDialog from "./dialog/CreateConversationDialog";

import Messages from "./Messages";
import Conversations from "./Conversations";

import { GlobalContext } from "../contexts/GlobalContext";
import { send_request } from "../scripts/request";
import {useNavigate} from "react-router";

const Chat = () => {
    const navigate = useNavigate();

    const { token, id } = useContext(GlobalContext);

    useEffect(() => {
        if (!token || !id) navigate('/login');
        else {
            document.title = 'Chat';
            loadConversation();
        }
    }, []);

    const [currentConversation, setCurrentConversation] = useState<any>({ id: null });

    const [conversations, setConversations] = useState<Array<any>>([]);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [input, setInput] = useState("");

    const [openConversationCreateDialog, setOpenConversationCreateDialog] = useState(false);

    const loadConversation = async (): Promise<void> => {
        // Load on start
        const response = await send_request(
            `/api/user/${id}/conversation`,
            "GET",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.error)
            toast.error(response.error);
        else
            setConversations(response);
    }

    const sendMessage = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        // TODO call ws

        if (!currentConversation.id)
            toast.error("No conversation selected");
        else {
            // API call
            const response = await send_request(
                `/api/message`,
                "POST",
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                {
                    conversation_id: currentConversation.id,
                    content: input
                }
            )

            // Render
            if (response.error)
                toast.error(response.error);
            else {
                setMessages([...messages, response]);
                setInput("");
            }
        }
    };

    const loadMessage = async (): Promise<void> => {
        // Load when conversation is changed
        if (currentConversation.id) {
            const response = await send_request(
                `/api/conversation/${currentConversation.id}/message`,
                "GET",
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            );

            if (response.error)
                toast.error(response.error);
            else
                setMessages(response);
        } else
            setMessages([]);
    };

    const updateConversation = async (conversation_id: number | null): Promise<void> => {
        if (conversation_id != currentConversation.id) {
            const response = await send_request(
                `/api/conversation/${conversation_id}`,
                "GET",
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            );

            if (response.error) {
                setCurrentConversation({ id: null });
                toast.error(response.error);
                loadConversation();
            }
            else {
                setCurrentConversation(response);
                if (conversations.every(c => c.id !== response.id))
                    setConversations([...conversations, response])
                loadMessage();
            }
        } else if (!conversation_id) {
            setCurrentConversation({ id: null });
            loadConversation();
        }
    }

    return (
        <Box h="90vh" display="flex">
            <Box w="20%" h="100%" overflowY="auto">
                <Box mt="1rem" p="1rem">
                    <Button colorScheme="blue" onClick={() => setOpenConversationCreateDialog(true)}>
                        Create conversation
                    </Button>
                    <CreateConversationDialog
                        open={openConversationCreateDialog}
                        setOpen={setOpenConversationCreateDialog}
                        conversations={conversations}
                        setConversations={setConversations}
                        setCurrentConversation={setCurrentConversation}
                    />
                </Box>
                <Conversations
                    setCurrentConversation={setCurrentConversation}
                    conversations={conversations}
                    currentConversation={currentConversation}
                    updateConversation={updateConversation}
                    setConversations={setConversations}
                />
            </Box>
            <Box flex={1} display="flex" flexDirection="column" h="100%" overflowY="auto" w="80%">
                <Box display="flex" alignItems="center" p="8px">
                    <ChatIcon />
                    <Text as="h6" fontSize="xl" ml="8px">
                        {currentConversation.id ? currentConversation.name : "Select a conversation"}
                    </Text>
                </Box>
                <Messages messages={messages} />
                <form onSubmit={sendMessage}>
                    <Stack direction="row">
                        <Input width="100%" placeholder="Type a message" value={input} onChange={(event) => setInput(event.target.value)} />
                        <Button type="submit" colorScheme="blue">Send</Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default Chat;