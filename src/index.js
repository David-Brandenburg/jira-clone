import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { LoggedinContextProvider } from './context/loggedinContext.js';
import App from "./App";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Router>
		<LoggedinContextProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</LoggedinContextProvider>
	</Router>
);

// for randomProfileImages on RoboHash
function generateRandomString() {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const minLength = 4;
	const maxLength = 16;
	const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
	let result = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	};
	return result;
};

export {generateRandomString}
