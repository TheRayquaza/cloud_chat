import {MouseEvent, useState} from "react";
import { toast } from "react-toastify";
import {Box, Card, CardContent, Typography, TextField, Button, Link} from "@mui/material";

import { send_request } from "./scripts/request.ts"

function Register(): JSX.Element {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleClick = async (event: MouseEvent<HTMLInputElement>) : Promise<void> => {
        event.preventDefault();
        let response: any = await send_request("/api/register", "POST", {"Content-Type": "application/json"}, {username: username, password: password});
        if (!response || response.error)
            toast.error(response ? response.error : "Unable to register " + username);
        else {
            toast.success(username + " registered successfully");
            localStorage.setItem("id", response.id);
            localStorage.setItem("username", response.username);
            localStorage.setItem("token", response.token);
            localStorage.setItem("logged_in", "true")
            window.location.assign("/chat")
        }
    }
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
            }}
        >
            <Card sx={{minWidth: 275}}>
                <CardContent>
                    <Typography variant="h5" sx={{mb: 2}}>
                        Create a new account
                    </Typography>
                    <Box component="form">
                        <TextField
                            fullWidth
                            label="Username"
                            type="text"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{mb: 2}}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{mb: 2}}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            onClick={handleClick}
                            sx={{mb: 2}}
                        >
                            Register
                        </Button>
                        <Typography variant="body2">
                            You already have an account?
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                color="secondary"
                                sx={{ml: 1}}
                            >
                                Login to your account
                            </Button>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Register;