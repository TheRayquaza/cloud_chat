import {Dispatch, SetStateAction, useContext} from "react";
import { Link } from "react-router-dom";

import { Button, Flex, Text } from "@chakra-ui/react";

import ThemeSwich from "./ThemeSwitch";
import Logout from "./Logout";

import { GlobalContext } from "../contexts/GlobalContext";

type HeaderProps = {
    setLogoutOpen: Dispatch<SetStateAction<boolean>>;
    logoutOpen: boolean;
};

const Header = (props: HeaderProps) => {
    const { loggedIn } = useContext(GlobalContext);
    const { setLogoutOpen, logoutOpen } = props;

    return (
        <Flex as="header" align="center" justify="space-between" bg="primary" py={4} px={8} >
            <Logout open={logoutOpen} setOpen={setLogoutOpen} />

            <Text color="secondary" variant="h6" flex={1}>
                Loqui Chat
            </Text>
            <Flex gap={3}>
                <Button as={Link} to="/">
                    Home
                </Button>
                {loggedIn ? (
                    <>
                        <Button  as={Link} to="/chat">
                            Chat
                        </Button>
                        <Button  onClick={() => setLogoutOpen(true)}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button  as={Link} to="/login">
                            Login
                        </Button>
                        <Button as={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
                <ThemeSwich/>
            </Flex>
        </Flex>
    );
};

export default Header;