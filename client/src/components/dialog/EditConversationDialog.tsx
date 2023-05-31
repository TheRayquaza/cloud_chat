import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Checkbox,
    List,
    ListItem,
} from "@chakra-ui/react";

import { send_request } from "../../scripts/request.ts";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";
import {send_ws} from "../../client_ws/ws.ts";

type EditConversationModalProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    conversationToEdit: any;
    setConversationToEdit: Dispatch<SetStateAction<any>>;
    currentConversation: any;
    setConversations: Dispatch<SetStateAction<any>>;
};

const EditConversationModal = (props: EditConversationModalProps) => {
    const {
        open,
        setOpen,
        conversationToEdit,
        setConversationToEdit,
        setConversations,
        currentConversation,
    } = props;
    const { token, id } = useContext(GlobalContext);

    const [usersToAdd, setUsersToAdd] = useState<number[]>([id as number]);
    const [usersToRemove, setUsersToRemove] = useState<number[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        send_request(
            `/api/user`,
            "GET",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        ).then((response: any) => {
            if (response.error) {
                toast.error(response.error);
                setUsers([]);
            } else {
                setUsers(response);
            }
        });
    }, []);

    const handleSave = async () => {
        const response = await send_request(
            `/api/conversation/${conversationToEdit.id}`,
            "PUT",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            {
                name: conversationToEdit.name,
                added_users: usersToAdd,
                removed_users: usersToRemove,
            }
        );

        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success("Conversation \"" + conversationToEdit.name + "\" edited successfully");
            for (let i = 0; i < usersToAdd.length; i++)
                if (usersToAdd[i] != id)
                    send_ws(conversationToEdit, "conversation", "created", { id : usersToAdd[i], username : ""});
            for (let i = 0; i < usersToRemove.length; i++)
                if (usersToRemove[i] != id)
                    send_ws(conversationToEdit, "conversation", "deleted", { id : usersToRemove[i], username : ""});
            setOpen(false);
            setConversationToEdit({ id: null });
            if (currentConversation.id === conversationToEdit.id) {
                setConversationToEdit(response);
            }
            setConversations((prev: any[]) => {
                return prev.map((conversation: any) => {
                    return conversation.id === conversationToEdit.id ? conversationToEdit : conversation;
                });
            });
        }
    };

    const userChecked = (event: ChangeEvent<HTMLInputElement>, user: any) => {
        if (event.target.checked) setUsersToAdd((prevUsersToAdd) => [...prevUsersToAdd, user.id]);
        else setUsersToRemove((prevUsersToAdd) => prevUsersToAdd.filter((id) => id !== user.id));
    };

    const onClose = () => {
        setOpen(false);
        setConversationToEdit({ id: null });
    };

    return (
        <Modal isOpen={open} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Conversation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Conversation Name</FormLabel>
                        <Input
                            placeholder="Enter conversation name"
                            value={conversationToEdit.name}
                            onChange={(e) => setConversationToEdit({ ...conversationToEdit, name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Add Users</FormLabel>
                        <List style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {users.map((user) => (
                                <ListItem key={user.id}>
                                    {conversationToEdit.admin_id !== user.id
                                        ? (<Checkbox onChange={(e) => userChecked(e, user)}>{user.username}</Checkbox>)
                                        : (<Checkbox isDisabled>{user.username}</Checkbox>)
                                    }
                                </ListItem>
                            ))}
                        </List>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Stack direction="row" spacing={4}>
                        <Button colorScheme="blue" onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditConversationModal;
