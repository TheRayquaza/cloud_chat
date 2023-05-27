import {Dispatch, SetStateAction, useState} from "react";

import { List, Box } from "@chakra-ui/react";

import Conversation from "./Conversation.tsx";

import DeleteConversationDialog from "./dialog/DeleteConversationDialog.tsx";
import EditConversationDialog from "./dialog/EditConversationDialog.tsx";

type ConversationsProps = {
    conversations: Array<any>,
    updateConversation: (id: number) => void,
    currentConversation: any,
    setConversations: Dispatch<SetStateAction<any>>,
    setCurrentConversation : Dispatch<SetStateAction<any>>
}

const Conversations = (props : ConversationsProps) => {
    const { conversations, updateConversation, currentConversation, setCurrentConversation, setConversations } = props;

    const [openConversationDeleteDialog, setOpenConversationDeleteDialog] = useState<boolean>(false);
    const [openConversationEditDialog, setOpenConversationEditDialog] = useState<boolean>(false);

    const [conversationToEdit, setConversationToEdit] = useState<any>({ id : null});
    const [conversationToDelete, setConversationToDelete] = useState<any>({ id : null});

    return (
        <Box>
            <DeleteConversationDialog
                open={openConversationDeleteDialog}
                setOpen={setOpenConversationDeleteDialog}
                conversationToDelete={conversationToDelete}
                setConversationToDelete={setConversationToDelete}
                currentConversation={currentConversation}
                setCurrentConversation={setCurrentConversation}
                setConversations={setConversations}
            />
            <EditConversationDialog
                open={openConversationEditDialog}
                setOpen={setOpenConversationEditDialog}
                conversationToEdit={conversationToEdit}
                setConversationToEdit={setConversationToEdit}
                setConversations={setConversations}
                currentConversation={currentConversation}
            />
            <List flexDirection="row" flexGrow={1}>
                {conversations.map((conversation) => (
                    <Conversation
                        conversation={conversation}
                        updateConversation={updateConversation}
                        currentConversation={currentConversation}
                        setConversationToDelete={setConversationToDelete}
                        setOpenConversationDeleteDialog={setOpenConversationDeleteDialog}
                        setConversationToEdit={setConversationToEdit}
                        setOpenConversationEditDialog={setOpenConversationEditDialog}
                        setCurrentConversation={setCurrentConversation}
                        setConversations={setConversations}
                    />
                ))}
            </List>
        </Box>
    );
};

export default Conversations;
