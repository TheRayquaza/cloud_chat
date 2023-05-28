import {Dispatch, SetStateAction, useState} from "react";

import { List, ListItem, Box } from "@chakra-ui/react";

import Conversation from "./Conversation.tsx";

import DeleteConversationDialog from "./dialog/DeleteConversationDialog.tsx";
import EditConversationDialog from "./dialog/EditConversationDialog.tsx";

import conversation from "../types/conversation.ts";

type ConversationsProps = {
    conversations: Array<conversation>,
    updateConversation: (id: number) => void,
    currentConversation: conversation,
    setConversations: Dispatch<SetStateAction<conversation[]>>,
    setCurrentConversation : Dispatch<SetStateAction<conversation>>
}

const Conversations = (props : ConversationsProps) => {
    const { conversations, updateConversation, currentConversation, setCurrentConversation, setConversations } = props;

    const [openConversationDeleteDialog, setOpenConversationDeleteDialog] = useState<boolean>(false);
    const [openConversationEditDialog, setOpenConversationEditDialog] = useState<boolean>(false);

    const [conversationToEdit, setConversationToEdit] = useState<conversation>({ id : null, edition_date : new Date(), creation_date : new Date(), name : "", admin_id : null});
    const [conversationToDelete, setConversationToDelete] = useState<conversation>({ id : null, edition_date : new Date(), creation_date : new Date(), name : "", admin_id : null});

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
                    <ListItem key={conversation.id}>
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
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Conversations;
