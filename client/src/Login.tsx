import {useState} from "react";
import {Box, Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        fetch(`http://localhost:8080/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8080"
            },
            body: JSON.stringify({username, password}),
        })
        .then((response) => response.json())
        .then((response) => {
            if (!response || response.error)
                    toast.error(response.error ? response.error : `Unable to login to ${username}`);
            else
            {
                toast.success(username + " logged in")
                localStorage.setItem("id", response.id);
                localStorage.setItem("username", response.username);
                localStorage.setItem("logged_in", "true");
            }
        });
    };

    return  (
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
                        Login to your account
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
                            onClick={handleLogin}
                            sx={{mb: 2}}
                        >
                            Login
                        </Button>
                        <Typography variant="body2">
                            Don't have an account?
                            <Button
                                component={Link}
                                to="/register"
                                variant="outlined"
                                color="secondary"
                                sx={{ml: 1}}
                            >
                                Create a new account
                            </Button>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
