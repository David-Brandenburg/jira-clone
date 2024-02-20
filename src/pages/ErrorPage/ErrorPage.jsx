import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";

const ErrorPage = () => {
	const { theme } = useContext(ThemeContext);
	const backHome = useNavigate();

	const handleBackHome = () => {
		toast.warn("You're being redirected to Home")
		setTimeout(() => {
			backHome("/home");
		}, 6000);
	}

	return (
		<div className={`main-content error-page ${theme}`}>
			<ToastContainer />
			<i className="bi bi-bug-fill"></i>
			<h2>Error 404</h2>
			<p>Page not found!</p>
			<small onClick={handleBackHome}>Back to Home</small>
		</div>
	)
}

export default ErrorPage