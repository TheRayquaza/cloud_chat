import { useState, useContext } from "react";
import { toast } from "react-toastify";

import { Text, Box, IconButton, Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

import { send_request } from "../scripts/request.ts";
import {GlobalContext} from "../contexts/GlobalContext.tsx";

type MessageProps = {
    message : any
}

const Message = (props : MessageProps) => {
    const { message } = props;
    const { token, id } = useContext(GlobalContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedContent(message.content);
    };

    const handleSaveClick = async () => {
        // TODO: call ws

        const response = await send_request(
            `/api/message/${message.id}`,
            "PUT",
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            {
                content: editedContent
            });
        if (response.error) toast.error(response.error);
        else setIsEditing(false);
    };

    const handleChange = (event : any) => {
        setEditedContent(event.target.value);
    };

    return (
        <Box mb="1rem">
            {isEditing && message.id == id ? (
                <Box display="flex" alignItems="center">
                    <Editable value={editedContent} onChange={handleChange}>
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
                    <IconButton
                        icon={<EditIcon />}
                        variant="ghost"
                        colorScheme="blue"
                        onClick={handleEditClick}
                        aria-label="Edit"
                    />
                    <IconButton
                        aria-label={"Delete"}
                        icon={<CloseIcon />}
                        variant="ghost"
                        colorScheme="red"

                    />
                </Box>
            )}
            <Text variant="body2">{message.edition_date}</Text>
        </Box>
    );
};

export default Message;