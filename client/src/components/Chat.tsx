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
import { send_ws, socket } from "../client_ws/ws.ts";

import conversation from "../types/conversation";
import message from "../types/message";

const Chat = () => {
    const navigate = useNavigate();
    const { token, id, loggedIn, username, setToken, setUsername, setLoggedIn, setId } = useContext(GlobalContext);

    const [currentConversation, setCurrentConversation] = useState<conversation>({ id: null, edition_date: new Date(), creation_date: new Date(), name: "" , admin_id: -1});

    const [conversations, setConversations] = useState<Array<conversation>>([]);
    const [messages, setMessages] = useState<message[]>([]);
    const [input, setInput] = useState("");

    const [openConversationCreateDialog, setOpenConversationCreateDialog] = useState(false);

    useEffect(() => {
        if (!token || !id || !loggedIn) {
            if (localStorage.getItem("token") && localStorage.getItem("id") && localStorage.getItem("username")) {
                setToken(localStorage.getItem("token") as string);
                setId(parseInt(localStorage.getItem("id") as string));
                setUsername(localStorage.getItem("username") as string);
                setLoggedIn(true);
            } else
                navigate("/login");
        } else {
            document.title = "Chat";
            loadConversation();

            send_ws({ id : id, username : username }, "auth");

            socket.onmessage = (event : MessageEvent) => {
                const data = JSON.parse(event.data);
                if (data.type === "message") {
                    const message = data.content;
                    if (data.action === "created") {
                        setMessages(prev => {
                            return [...prev, message]
                        })
                    } else if (data.action === "deleted") {
                        setMessages(prev => {
                            return prev.filter(m => m.id !== message.id);
                        })
                    } else if (data.action === "updated") {
                        setMessages(prev => {
                            return prev.map(m => m.id === message.id ? message : m);
                        })
                    }
                } else if (data.type === "conversation") {
                    const conversation = data.content;
                    console.log(conversation);
                    if (data.action === "created") {
                        setConversations(prev => {
                            return [...prev, conversation]
                        })
                    } else if (data.action === "deleted") {
                        setConversations(prev => {
                            return prev.filter(m => m.id !== conversation.id);
                        })
                    } else if (data.action === "updated")
                        setConversations(prev => {
                            return prev.map(m => m.id === conversation.id ? conversation : m);
                        });
                }
            };
        }
    }, []);

    useEffect(() => {
        loadMessage(currentConversation.id as number);
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
            setConversations(response);
    }

    const sendMessage = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

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
                send_ws(response, "message", "created", { id : id as number, username : username });
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
                setCurrentConversation({ id: null, edition_date : new Date(), creation_date: new Date(), name: "", admin_id: -1 });
                toast.error(response.error);
                await loadConversation();
            }
            else {
                setCurrentConversation(response);
                if (conversations.every(c => c.id !== response.id))
                    setConversations([...conversations, response]);
                send_ws(response, "conversation", "updated", { id : id as number, username : username });
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