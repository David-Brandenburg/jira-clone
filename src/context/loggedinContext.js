import { createContext, useEffect, useState } from "react";

export const LoggedinContext = createContext();

export const LoggedinContextProvider = ({children}) => {
	const [stayLoggedIn, setStayLoggedIn] = useState(localStorage.getItem("stayLoggedIn") === "true" ? true : false);
	const [loggedIn, setLoggedIn] = useState(stayLoggedIn ? (localStorage.getItem("loggedIn") === "true" ? true : false) : false);

	useEffect(() => {
		localStorage.setItem("stayLoggedIn", stayLoggedIn);
	}, [stayLoggedIn])

	useEffect(() => {
		localStorage.setItem("loggedIn", loggedIn);
	}, [loggedIn])

	return (
		<LoggedinContext.Provider value={{loggedIn, setLoggedIn, setStayLoggedIn}}>
			{children}
		</LoggedinContext.Provider>
	);
};