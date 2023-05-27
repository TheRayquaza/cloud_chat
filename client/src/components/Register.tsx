import {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { Box, Text, Input, Button, Card } from "@chakra-ui/react";
import { CardContent } from "@mui/material";

import { GlobalContext } from "../contexts/GlobalContext";
import { send_request } from "../scripts/request";

const Register = () => {
    useEffect(() => {
        document.title = "Register";
    }, []);

    let navigate = useNavigate();
    const { username, setUsername, setLoggedIn, setToken, setId } = useContext(GlobalContext);
    const [password, setPassword] = useState("");

    const handleClick = async (): Promise<void> => {
        let response: any = await send_request("/api/register", "POST", { "Content-Type": "application/json" }, { username: username, password: password });
        if (!response || response.error)
            toast.error(response ? response.error : "Unable to register " + username);
        else {
            toast.success(username + " registered successfully");
            setId(response.id);
            setUsername(response.username);
            setLoggedIn(true);
            setToken(response.token);
            navigate("/chat");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="90vh"
        >
            <Card minWidth={275}>
                <CardContent>
                    <Text textAlign="center" fontSize="xl" variant="h5" marginBottom={2}>
                        Create a new account
                    </Text>
                    <Box as="form">
                        <Text fontSize="sm" marginBottom={2}>Username</Text>
                        <Input
                            width="100%"
                            type="text"
                            variant="outline"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            marginBottom={2}
                        />
                        <Text fontSize="sm" marginBottom={2}>Password</Text>
                        <Input
                            width="100%"
                            variant="outline"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            marginBottom={2}
                        />
                        <Button
                            variant="solid"
                            colorScheme="blue"
                            size="lg"
                            width="full"
                            onClick={handleClick}
                            marginBottom={2}
                        >
                            Register
                        </Button>
                        <Text>
                            You already have an account?
                            <Button
                                onClick={() => navigate("/login")}
                                variant="outline"
                                colorScheme="red"
                                marginLeft={1}
                            >
                                Login to your account
                            </Button>
                        </Text>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;