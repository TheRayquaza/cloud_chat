import {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router";
import { Box, Button, Text, Input, Card } from "@chakra-ui/react";
import { CardContent } from "@mui/material";
import { toast } from "react-toastify";

import { GlobalContext } from "../contexts/GlobalContext";
import { send_request } from "../scripts/request";

const Login = () => {
    useEffect(() => {
        document.title = 'Login';
    }, []);


    let navigate = useNavigate();
    const { username, setUsername, setId, setToken, setLoggedIn } = useContext(GlobalContext);
    const [password, setPassword] = useState("");

    const handleLogin = async (): Promise<void> => {
        const response = await send_request(
            "/api/login",
            "POST",
            { "Content-Type": "application/json" },
            { username: username, password: password }
        );

        if (response.error)
            toast.error(response.error ? response.error : `Unable to login ${username}`);
        else {
            toast.success(username + " logged in")
            setId(response.id);
            setUsername(username);
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
                    <Text fontSize="xl" variant="h5" marginBottom={2} textAlign="center">
                        Login to your account
                    </Text>
                    <Box as="form">
                        <Text fontSize="sm" marginBottom={2}>Username</Text>
                        <Input
                            width="100%"
                            type="text"
                            variant="outline"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            marginBottom={2}
                        />
                        <Text fontSize="sm" marginBottom={2}>Password</Text>
                        <Input
                            width="100%"
                            variant="outline"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            marginBottom={2}
                        />
                        <Button
                            variant="solid"
                            colorScheme="blue"
                            size="lg"
                            width="full"
                            onClick={handleLogin}
                            marginBottom={2}
                        >
                            Login
                        </Button>
                        <Text>
                            You don't have an account?
                            <Button
                                onClick={() => navigate("/register")}
                                variant="outline"
                                colorScheme="red"
                                marginLeft={1}
                            >
                                Create a new account
                            </Button>
                        </Text>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;