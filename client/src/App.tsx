import {useEffect, useMemo, useState} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CssBaseline from '@mui/material/CssBaseline';

import About from "./About.tsx";
import Home from "./Home.tsx";
import Chat from "./Chat.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import Logout from "./Logout.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Default from "./Default.tsx";

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const theme = useMemo(
        () => createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } }),
        [isDarkMode]
    );

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    useEffect(() => {
        document.title = 'Loqui Chat';
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <ToastContainer/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout/>} />
                    <Route path="*" element={<Default/>} />
                </Routes>
                <Footer/>
            </BrowserRouter>
        </ThemeProvider>
    );
}


export default App;