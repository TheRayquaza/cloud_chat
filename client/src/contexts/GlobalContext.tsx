import {useState, createContext, Dispatch, SetStateAction, ReactNode} from "react";

type GlobalContextType = {
    token: string;
    setToken: Dispatch<SetStateAction<string>>;
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    id: number | null;
    setId: Dispatch<SetStateAction<number | null>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;

};

const initialState: GlobalContextType = {
    token: "",
    setToken: () => {},
    loggedIn: false,
    setLoggedIn: () => {},
    id: null,
    setId: () => {},
    username: "",
    setUsername: () => {}
};

export const GlobalContext = createContext<GlobalContextType>(initialState);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [username, setUsername] = useState<string>("");

    return (
        <GlobalContext.Provider value={{ token, setToken, loggedIn, setLoggedIn, id, setId, username, setUsername }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
