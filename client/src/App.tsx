import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import About from './components/About';
import Home from './components/Home';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import Header from './components/Header';
import Footer from './components/Footer';
import Default from './components/Default';
import Db from "./components/Db.tsx";

import GlobalProvider from './contexts/GlobalContext';


const App = () => {
    const [logoutOpen, setLogoutOpen] = useState(false);

    return (
        <BrowserRouter>
            <GlobalProvider>
                <Header setLogoutOpen={setLogoutOpen} logoutOpen={logoutOpen} />
                <ToastContainer limit={5} pauseOnHover={false} autoClose={1500}/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/db" element={<Db/>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout open={logoutOpen} setOpen={setLogoutOpen} />} />
                    <Route path="*" element={<Default />} />
                </Routes>
                <Footer />
            </GlobalProvider>
        </BrowserRouter>
    );
}

export default App;
