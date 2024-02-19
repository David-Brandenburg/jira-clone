import { createContext, useEffect, useState } from "react";

export const LoggedinContext = createContext();

export const LoggedinContextProvider = ({children}) => {
	const [stayLoggedIn, setStayLoggedIn] = useState(localStorage.getItem("stayLoggedIn") === "true" ? true : false);
	const [loggedIn, setLoggedIn] = useState(stayLoggedIn ? (localStorage.getItem("loggedIn") === "true" ? true : false) : false);
	const [loggedInUser, setLoggedInUser] = useState(null);

	useEffect(() => {
		localStorage.setItem("stayLoggedIn", stayLoggedIn);
	}, [stayLoggedIn])

	useEffect(() => {
		localStorage.setItem("loggedIn", loggedIn);
	}, [loggedIn])

	return (
		<LoggedinContext.Provider value={{loggedIn, setLoggedIn, setStayLoggedIn, loggedInUser, setLoggedInUser}}>
			{children}
		</LoggedinContext.Provider>
	);
};