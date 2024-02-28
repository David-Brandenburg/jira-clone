import { useState, useContext } from 'react';
import Login from './Login';
import Register from './Register';
import { LoggedinContext } from '../../context/loggedinContext';
import { ThemeContext } from '../../context/themeContext';
import img from "../../assets/jsw.webp"
import './loginandregister.scss';

const LoginAndRegister = () => {
	const [page, setPage] = useState('register');
	const { setLoggedIn } = useContext(LoggedinContext);
	const { theme } = useContext(ThemeContext);

	return (
		<div className="loginregisterpage">
			<div className="info">
				<div className={`text-wrapper ${theme}`}>
					<h2>Clone Way Software ist das führende, von agilen Teams verwendete Software-Entwicklertool</h2>
					<p>Mehr als 100.000 Teams vertrauen auf uns, wenn es um die Planung, Nachverfolgung, Veröffentlichung und Verwaltung erstklassiger Software geht.</p>
				</div>
				<div className="img-wrapper">
					<img src={img} alt="" />
				</div>
			</div>
			{page === 'register' ? (
				<Register page={page} setPage={setPage} />
			) : (
				<Login page={page} setPage={setPage} setLoggedIn={setLoggedIn} />
			)}
		</div>
	);
};

export default LoginAndRegister;