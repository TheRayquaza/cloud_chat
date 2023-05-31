import {useState, useContext, Dispatch, SetStateAction} from "react";
import { toast } from "react-toastify";

import {
    Text,
    Box,
    IconButton,
    Editable,
    EditablePreview,
    EditableInput,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

import { send_request } from "../scripts/request.ts";
import { GlobalContext } from "../contexts/GlobalContext.tsx";
import message from "../types/message.ts";
import {send_ws} from "../client_ws/ws.ts";

type MessageProps = {
    message: message;
    setMessages: Dispatch<SetStateAction<message[]>>;
};

const Message = (props: MessageProps) => {
    const { message, setMessages } = props;
    const { token, id, username } = useContext(GlobalContext);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content)

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedContent(message.content);
    };

    const handleSaveClick = async () => {
        const response = await send_request(
            `/api/message/${message.id}`,
            "PUT",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            {
                content: editedContent,
            }
        );

        if (response.error)
            toast.error(response.error);
        else {
            setIsEditing(false);
            message.content = editedContent;
            send_ws(response, "message", "updated",  { id : id as number, username : username });
        }
    };

    const handleDeleteClick = async () => {
        const response = await send_request(
            `/api/message/${message.id}`,
            "DELETE",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.error)
            toast.error(response.error);
        else {
            send_ws(message, "message", "deleted",  { id : id as number, username : username });
            setMessages((messages) => messages.filter((m) => m.id !== message.id));
        }
    };

    return (
        <Box mb="1rem">
            {isEditing && message.user_id === id ? (
                <Box display="flex" alignItems="center">
                    <Editable value={editedContent} onChange={(value) => setEditedContent(value)}>
                        <EditableInput />
                        <EditablePreview />
                    </Editable>
                    <IconButton
                        icon={<CheckIcon />}
                        variant="ghost"
                        colorScheme="green"
                        onClick={handleSaveClick}
                        aria-label="Save"
                    />
                    <IconButton
                        icon={<CloseIcon />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={handleCancelClick}
                        aria-label="Cancel"
                    />
                </Box>
            ) : (
                <Box display="flex" alignItems="center">
                    <Text variant="body1" flexGrow={1} mr="1rem">
                        {message.content}
                    </Text>
                    {message.user_id === id && (
                        <>
                            <IconButton
                                icon={<EditIcon />}
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => setIsEditing(true)}
                                aria-label="Edit"
                            />
                            <IconButton
                                icon={<CloseIcon />}
                                variant="ghost"
                                colorScheme="red"
                                onClick={handleDeleteClick}
                                aria-label="Delete"
                            />
                        </>
                    )}
                </Box>
            )}
            <Text variant="body2">{message.edition_date}</Text>
        </Box>
    );
};

export default Message;