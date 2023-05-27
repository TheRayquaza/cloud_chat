import { useContext, Dispatch, SetStateAction} from "react";
import { toast } from "react-toastify";

import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text } from "@chakra-ui/react";

import { send_request } from "../../scripts/request.ts";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";

type DeleteConversationDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    currentConversation: any;
    setCurrentConversation: Dispatch<SetStateAction<any>>;
    setConversations: Dispatch<SetStateAction<any>>;
    conversationToDelete: any;
    setConversationToDelete: Dispatch<SetStateAction<any>>;
};

const DeleteConversationDialog = (props: DeleteConversationDialogProps) => {
    const { token } = useContext(GlobalContext);
    const {open, setOpen, currentConversation, setConversations, conversationToDelete, setCurrentConversation, setConversationToDelete} = props;

    const handleDeleteCancel = () => {
        setOpen(false);
        setConversationToDelete({ id: null });
    };

    const deleteConversation = async (): Promise<void> => {
        // TODO call ws

        // API call
        const response = await send_request(
            `/api/conversation/${conversationToDelete.id}`,
            "DELETE",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        // Render
        if (response.error) toast.error(response.error);
        else {
            toast.success("Conversation \"" + conversationToDelete.name + "\" deleted");
            if (currentConversation.id === conversationToDelete.id) setCurrentConversation({ id: null });
            setConversations((conversations: any[]) => conversations.filter((conversation: any) => conversation.id !== conversationToDelete.id));
            setOpen(false);
        }
    };

    return (
        <Modal isOpen={open} onClose={handleDeleteCancel}>
            <ModalOverlay />
            <ModalContent padding={3}>
                <ModalHeader>Delete Conversation</ModalHeader>
                <ModalBody>
                    <Text>
                        Are you sure you want to delete the conversation "{conversationToDelete.name}"?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={deleteConversation}>
                        Delete
                    </Button>
                    <Button colorScheme="blue" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteConversationDialog;