import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedinContext } from "../../context/loggedinContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({setPage}) => {
	const [loginData, setLoginData] = useState({mail: "", pass: ""})
	const { setLoggedIn, setStayLoggedIn } = useContext(LoggedinContext)
	const usenavigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const email = formData.get('email');
		const password = formData.get('password');
		setLoginData({mail: email, pass: password})
	}

	const handleCheckbox = () => {
		setStayLoggedIn(prev => !prev);
	}

	useEffect(() => {
		if (loginData.mail !== "" && loginData.pass !== "") {
			login();
		}
	}, [loginData])

	const login = async () => {
		const url = "http://localhost:5000/users"
		const optionsGet = {
			method: "GET",
		};

		try {
			const response = await fetch(url, optionsGet)
			if (!response.ok){
				throw new Error("Failed to fetch!", response.status)
			}
			const users = await response.json();
			const findUser = users.find(user => user.email === loginData.mail)
			if (findUser) {
				const userId = findUser.id;
				const userPass = findUser.password;
				const urlPatch = `http://localhost:5000/users/${userId}`
				const optionsPatch = {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						"isloggedin": true,
					})
				}

				if (userPass === loginData.pass){
					const patch = await fetch(urlPatch, optionsPatch)
					if (!patch.ok){
						throw new Error("Failed to fetch/login", patch.status)
					}
					toast.success("Successfully logged in!")
					setLoggedIn(true)
					setTimeout(() => {
						usenavigate("/home")
					}, 500);
				} else {
					toast.error("Wrong username or password!")
					throw new Error("Wrong username or password!")
				}
			} else {
				toast.error("Wrong username or password!")
				throw new Error("Wrong username or password!")
			}
			console.log(users)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="form-wrapper">
			<ToastContainer />
			<div className="text-wrapper">
				<h2>&nbsp;</h2>
				<p>&nbsp;</p>
			</div>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<legend>Login</legend>
					<div className='input-row'>
						<label htmlFor="">Ihre E-Mail:</label>
						<input type="email" name="email" id="email" defaultValue=""/>
					</div>
					<div className='input-row'>
						<label htmlFor="password">Passwort:</label>
						<input type="password" name="password" id="password" defaultValue=""/>
					</div>
					<div className='input-button-row'>
						<label htmlFor="staylogged">
							<input type="checkbox" name="staylogged" id="staylogged" onChange={handleCheckbox}/>
							<small>Eingeloggt bleiben!</small>
						</label>
						<button>Einloggen</button>
					</div>
					<p>Sie haben noch keinen Account? <small onClick={(() => {setPage("register")})}>Registrieren!</small></p>
				</fieldset>
			</form>
		</div>
	)
}

export default Login