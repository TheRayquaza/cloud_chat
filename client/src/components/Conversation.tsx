import {toast} from "react-toastify";
import {Dispatch, SetStateAction, useContext} from "react";

import { Flex, Text, Button } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CloseIcon } from "@chakra-ui/icons";

import {GlobalContext} from "../contexts/GlobalContext.tsx";
import {send_request} from "../scripts/request.ts";
import conversation from "../types/conversation.ts";

type ConversationProps = {
    conversation : conversation,
    setConversationToDelete: Dispatch<SetStateAction<conversation>>,
    setConversationToEdit: Dispatch<SetStateAction<conversation>>,
    setOpenConversationDeleteDialog: Dispatch<SetStateAction<boolean>>,
    setOpenConversationEditDialog: Dispatch<SetStateAction<boolean>>,
    currentConversation: conversation,
    updateConversation: (id: number) => void,
    setCurrentConversation: Dispatch<SetStateAction<conversation>>,
    setConversations: Dispatch<SetStateAction<conversation[]>>
};

const Conversation = ( props : ConversationProps) => {
    const {
        conversation,
        setOpenConversationEditDialog,
        setOpenConversationDeleteDialog,
        setConversationToDelete,
        updateConversation,
        setConversationToEdit,
        currentConversation,
        setCurrentConversation,
        setConversations
    } = props;
    const { id, token } = useContext(GlobalContext);

    const onDelete = () => {
        setConversationToDelete(conversation);
        setOpenConversationDeleteDialog(true);
    }

    const onEdit = () => {
        setConversationToEdit(conversation);
        setOpenConversationEditDialog(true);
    }

    const leaveConversation = async () => {
        // TODO: call ws

        // API call
        const response = await send_request(
            `/api/conversation/${conversation.id}/leave`,
            "DELETE",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        // Render
        if (response.error) toast.error(response.error);
        else {
            toast.success("You left the conversation \"" + conversation.name + "\"");
            if (currentConversation.id === conversation.id)
                setCurrentConversation({ id: null, name: "", admin_id: -1, creation_date: new Date(), edition_date : new Date() });
            setConversations((conversations: conversation[]) => conversations.filter((c: any) => c.id !== conversation.id));
        }
    }

    return (
        <Flex alignItems="center" width="100%">
            <Button
                variant="ghost"
                onClick={() => updateConversation(conversation.id as number)}
                width="100%"
                justifyContent="flex-start"
                alignItems="center"
            >
                <Text fontSize="md" maxW="80%" isTruncated>
                    {conversation.name}
                </Text>
            </Button>
            {conversation.id === currentConversation.id && conversation.admin_id == id && (
                <Button
                    variant="ghost"
                    onClick={onEdit}
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                />
            )}
            {conversation.id === currentConversation.id && conversation.admin_id != id && (
                <Button
                    variant="ghost"
                    onClick={leaveConversation}
                    leftIcon={<CloseIcon/>}
                    colorScheme="yellow"
                />
            )}
            {conversation.id === currentConversation.id && conversation.admin_id == id && (
                <Button
                    variant="ghost"
                    onClick={onDelete}
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                />
            )}
        </Flex>
    );
};

export default Conversation;