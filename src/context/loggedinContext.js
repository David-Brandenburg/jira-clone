import { createContext, useEffect, useState } from "react";

export const LoggedinContext = createContext();

export const LoggedinContextProvider = ({children}) => {
    const [stayLoggedIn, setStayLoggedIn] = useState(localStorage.getItem("stayLoggedIn") === "true" ? true : false);
    const [loggedIn, setLoggedIn] = useState(stayLoggedIn ? (localStorage.getItem("loggedIn") === "true" ? true : false) : false);
    const storedLoggedInUser = localStorage.getItem("loggedInUser");
    const [loggedInUser, setLoggedInUser] = useState(loggedIn ? (storedLoggedInUser ? JSON.parse(storedLoggedInUser) : null) : null);

    useEffect(() => {
        localStorage.setItem("stayLoggedIn", stayLoggedIn);
    }, [stayLoggedIn])

    useEffect(() => {
        localStorage.setItem("loggedIn", loggedIn);
    }, [loggedIn])

    useEffect(() => {
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
    }, [loggedInUser])

    return (
        <LoggedinContext.Provider value={{loggedIn, setLoggedIn, setStayLoggedIn, loggedInUser, setLoggedInUser}}>
            {children}
        </LoggedinContext.Provider>
    );
};
