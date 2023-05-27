import {useState, useContext, Dispatch, SetStateAction} from "react";
import {Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, FormControl, FormLabel, Input, Stack,} from "@chakra-ui/react";
import { send_request } from "../../scripts/request.ts";
import { toast } from "react-toastify";
import { GlobalContext } from "../../contexts/GlobalContext";

type CreateConversationDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    setCurrentConversation: Dispatch<SetStateAction<any>>
    setConversations: Dispatch<SetStateAction<any>>
    conversations: any[];
};

const CreateConversationDialog = (props: CreateConversationDialogProps) => {
    const { open, setOpen, setCurrentConversation, setConversations, conversations } = props;
    const [newConversationName, setNewConversationName] = useState("");
    const { token } = useContext(GlobalContext);

    const addConversation = async (): Promise<void> => {
        // TODO call ws

        // API call
        const response = await send_request(
            "/api/conversation",
            "POST",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            { name: newConversationName, users_id: [] }
        );

        // Render
        if (!response || response.error) toast.error(response.error);
        else {
            setCurrentConversation(response);
            setConversations([...conversations, response]);
            toast.success(`Conversation \""${newConversationName}"\" created`);
        }

        setOpen(false);
    };

    return (
        <Modal isOpen={open} onClose={() => setOpen(false)}>
            <ModalOverlay />
            <ModalContent padding={3}>
                <ModalHeader>Create Conversation</ModalHeader>
                <Stack spacing={4}>
                    <FormControl>
                        <FormLabel>Conversation Name</FormLabel>
                        <Input
                            value={newConversationName}
                            onChange={(event) => setNewConversationName(event.target.value)}
                            placeholder="Enter conversation name"
                        />
                    </FormControl>
                </Stack>
                <ModalFooter>
                    <Button onClick={addConversation} colorScheme="blue">
                        Create
                    </Button>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateConversationDialog;
