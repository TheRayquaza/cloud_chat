import {useState, useContext, useEffect, FormEvent} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import { Text, Box, Button, Input, Stack } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import CreateConversationDialog from "./dialog/CreateConversationDialog";
import Messages from "./Messages";
import Conversations from "./Conversations";

import { GlobalContext } from "../contexts/GlobalContext";
import { send_request } from "../scripts/request";

import conversation from "../types/conversation";
import message from "../types/message";
import {transformToConversations, transformToMessage, transformToMessages, transformToConversation } from "../scripts/transformers.ts";

const Chat = () => {
    const navigate = useNavigate();

    const { token, id, loggedIn } = useContext(GlobalContext);

    useEffect(() => {
        if (!token || !id || !loggedIn) navigate('/login');
        else {
            document.title = 'Chat';
            loadConversation();
        }
    }, []);

    const [currentConversation, setCurrentConversation] = useState<conversation>({ id: null, edition_date: new Date(), creation_date: new Date(), name: "" , admin_id: -1});

    const [conversations, setConversations] = useState<Array<conversation>>([]);
    const [messages, setMessages] = useState<message[]>([]);
    const [input, setInput] = useState("");

    const [openConversationCreateDialog, setOpenConversationCreateDialog] = useState(false);

    useEffect(() => {
        loadMessage(currentConversation.id as number);
        console.log("Reload message");
    }, [currentConversation]);

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
            setConversations(transformToConversations(response));
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
                setMessages([...messages, transformToMessage(response)]);
                setInput("");
            }
        }
    };

    const loadMessage = async (id : number): Promise<void> => {
        // Load when conversation is changed
        if (id) {
            const response = await send_request(
                `/api/conversation/${id}/message`,
                "GET",
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            );

            if (response.error)
                toast.error(response.error);
            else
                setMessages(transformToMessages(response));
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
                setCurrentConversation({ id: null, edition_date : new Date(), creation_date: new Date(), name: "", admin_id: -1 });
                toast.error(response.error);
                await loadConversation();
            }
            else {
                setCurrentConversation(transformToConversation(response));
                if (conversations.every(c => c.id !== response.id))
                    setConversations([...conversations, response])
            }
        } else if (!conversation_id) {
            setCurrentConversation({ id: null, edition_date : new Date(), creation_date: new Date(), name: "", admin_id: -1 });
            await loadConversation();
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
                <Messages messages={messages} setMessages={setMessages} />
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