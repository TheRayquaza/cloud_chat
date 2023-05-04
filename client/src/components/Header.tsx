import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import ChatIcon from '@mui/icons-material/Chat'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

function Header (): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('logged_in') === 'true')
    }, [])

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Loqui Chat
                </Typography>
                <Button component={Link} to="/">
                    <HomeIcon /> Home
                </Button>
                <Button component={Link} to="/about">
                    <InfoIcon /> About
                </Button>
                {isLoggedIn
                    ? (
                        <>
                            <Button component={Link} to="/chat">
                                <ChatIcon /> Chat
                            </Button>
                            <Button component={Link} to="/logout">
                                <LogoutIcon /> Logout
                            </Button>
                        </>
                    )
                    : (
                        <>
                            <Button component={Link} to="/login">
                                <LoginIcon /> Login
                            </Button>
                            <Button component={Link} to="/register">
                                <PersonAddIcon /> Register
                            </Button>
                        </>
                    )}
            </Toolbar>
        </AppBar>
    )
}

export default Header;