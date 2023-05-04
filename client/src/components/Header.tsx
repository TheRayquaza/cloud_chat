import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {AppBar, Button, Toolbar, Typography} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ChatIcon from '@mui/icons-material/Chat'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

function Header({isDarkMode, toggleDarkMode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('logged_in') === 'true');
    }, []);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography color="secondary" variant="h6" component="div" sx={{flexGrow: 1}}>
                    Loqui Chat
                </Typography>
                <Button color="secondary" component={Link} to="/">
                    <HomeIcon/> Home
                </Button>
                {isLoggedIn ? (
                    <>
                        <Button color="secondary" component={Link} to="/chat">
                            <ChatIcon/> Chat
                        </Button>
                        <Button color="secondary" component={Link} to="/logout">
                            <LogoutIcon/> Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="secondary" component={Link} to="/login">
                            <LoginIcon/> Login
                        </Button>
                        <Button color="secondary" component={Link} to="/register">
                            <PersonAddIcon/> Register
                        </Button>
                    </>
                )}
                <Button color="secondary" onClick={toggleDarkMode}>
                    {isDarkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                </Button>
            </Toolbar>
        </AppBar>
    );
}


export default Header;
