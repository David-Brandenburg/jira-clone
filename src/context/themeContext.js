import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({children}) => {
	const [theme, setTheme] = useState(localStorage.getItem("current_theme") || "light");

	useEffect(() => {
		localStorage.setItem("current_theme", theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{theme, setTheme}}>
			{children}
		</ThemeContext.Provider>
	)
}