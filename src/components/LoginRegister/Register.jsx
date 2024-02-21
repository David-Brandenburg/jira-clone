import { useState } from 'react'
import { generateRandomAvatar } from '../..';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({setPage}) => {
    const [regData, setRegData] = useState({mail: "", pass: ""});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        await register({mail: email, pass: password});
        setRegData({mail: "", pass: ""});
    }
    
    const register = async (regdata) => {
        const defaultPic = generateRandomAvatar();

        const url = "http://localhost:5000/users"
        const optionsGet = {
            method: "GET",
        };
        
        const newData = regdata;
        const optionsPost = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": newData.mail,
                "fname": "",
                "lname": "",
                "password": newData.pass,
                "avatar": defaultPic,
                "ticketId": [],
                "isadmin": false,
                "isloggedin": false,
				"id": Number,
            })
        }

        try {
            const response = await fetch(url, optionsGet)
            if (!response.ok){
                throw new Error("Failed to fetch!", response.status)
            }
            const data = await response.json();
            const checkUser = data.find(user => user.email === newData.mail)
            console.log(data)
            if (!checkUser) {
                const push = await fetch(url, optionsPost);
                if (!push.ok){
                    throw new Error("Failed to fetch!", push.status);
                }
				toast.success("Successfully registered")
				setTimeout(() => {
					setPage("login")
				}, 6000);
            } else {
                toast.warn("E-Mail is already in use!")
                throw new Error("E-Mail is already in use!")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="form-wrapper">
			<ToastContainer />
			<div className="text-wrapper">
				<h2>Erste Schritte</h2>
				<p>Kostenlos für bis zu 10 Benutzer</p>
			</div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Registration</legend>
                    <div className='input-row'>
                        <label htmlFor="">Ihre E-Mail:</label>
                        <input type="email" name="email" id="email" defaultValue={regData.mail}/>
                    </div>
                    <div className='input-row'>
                        <label htmlFor="password">Passwort:</label>
                        <input type="password" name="password" id="password" defaultValue={regData.pass}/>
                    </div>
                    <div className='input-button-row' style={{justifyContent: "flex-end"}}>
                        <button>Registrieren</button>
                    </div>
                    <p>Sie haben bereits einen Account? <small onClick={(() => {setPage("login")})}>Anmelden!</small></p>
                </fieldset>
            </form>
        </div>
    )
}

export default Register
