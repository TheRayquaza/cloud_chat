import {ChangeEvent, FormEvent, useState} from "react";
import { Container, Card, CardContent, Typography, TextField, Button, Link } from "@mui/material";

import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event : ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event : ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event : FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        // Submit registration data
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <Header/>

            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm">
                    <Card sx={{ boxShadow: 10 }}>
                        <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                            <Typography variant="h4" sx={{ mb: { xs: 2, md: 5 } }}>
                                Create an account
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <TextField
                                            label="Username"
                                            variant="outlined"
                                            fullWidth
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <TextField
                                            label="Password"
                                            variant="outlined"
                                            fullWidth
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 pt-2">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        type="submit"
                                        fullWidth
                                    >
                                        Submit
                                    </Button>
                                </div>
                                <br />
                                <div className="text-center pb-4">
                                    <Typography variant="body1" sx={{ mb: 0 }}>
                                        Already have an account?
                                    </Typography>
                                    <Link href="/login" variant="button" sx={{ ml: 1 }}>
                                        Login to your account
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </div>

            <Footer/>
        </div>
    );
}

export default RegisterPage;