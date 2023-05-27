import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import {useNavigate} from "react-router";

type LogoutProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const Logout = (props: LogoutProps) => {
    const navigate = useNavigate();
    const { setLoggedIn } = useContext(GlobalContext);
    const { open, setOpen } = props;

    const handleNo = () => { setOpen(false) };
    const handleYes = () => {
        setOpen(false);
        setLoggedIn(false);
        navigate("/login");
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