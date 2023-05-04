import { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography,} from "@mui/material";

import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        fetch(`${document.location.origin}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (!response || response.error) {
                    // Show snackbar with error message
                    console.error(
                        response.error
                            ? response.error
                            : `Unable to login to ${username}`
                    );
                } else {
                    localStorage.setItem("id", response.id);
                    localStorage.setItem("username", response.username);
                    localStorage.setItem("logged_in", "true");
                    window.location.assign("/chat");
                }
            });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Header />
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h5">Login to your account</Typography>
                        </Box>
                        <Box component="form" noValidate autoComplete="off">
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pt: 2,
                            }}
                        >
                            <Typography variant="body2">
                                Don't have an account?
                            </Typography>
                            <Button
                                href="/register/register.html"
                                variant="outlined"
                                color="primary"
                                sx={{ ml: 1 }}
                            >
                                Create a new account
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Footer />
        </Box>
    );
};

export default Login;
