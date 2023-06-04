import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import {useNavigate} from "react-router";
import {send_ws} from "../client_ws/ws.ts";

type LogoutProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const Logout = (props: LogoutProps) => {
    const navigate = useNavigate();
    const { setLoggedIn, username, id } = useContext(GlobalContext);
    const { open, setOpen } = props;

    const handleNo = () => { setOpen(false) };
    const handleYes = () => {
        setOpen(false);
        setLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("id");
        navigate("/login");

        send_ws({}, "logout", "default", { username : username, id : id as number})
    }

    const handleClose = () => { setOpen(false); }

    return (
        <Modal isOpen={open} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Logout</ModalHeader>
                <ModalBody>
                    Do you want to logout ?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={handleYes}>Logout</Button>
                    <Button colorScheme="blue" onClick={handleNo}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default Logout;