import { useEffect } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";

import About from "./About.tsx";
import Home from "./Home.tsx";
import Chat from "./Chat.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

function App (): JSX.Element {
  useEffect(() => {
    document.title = 'Loqui Chat'
  }, [])

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register/>}></Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App;