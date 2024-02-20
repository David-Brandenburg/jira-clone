import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({children}) => {
	const [theme, setTheme] = useState(localStorage.getItem("current_theme") || "light");

	useEffect(() => {
		localStorage.setItem("current_theme", theme)
	}, [theme])

	useEffect(() => {
		const body = document.querySelector("body");
		if (theme === "light"){
			body.classList.add("body-light")
			body.classList.remove("body-dark")
		} else if (theme === "dark"){
			body.classList.add("body-dark")
			body.classList.remove("body-light")
		}
	}, [theme])

	return (
		<ThemeContext.Provider value={{theme, setTheme}}>
			{children}
		</ThemeContext.Provider>
	)
}