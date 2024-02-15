import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoggedinContext } from './context/loggedinContext';
import LoginAndRegister from './components/LoginRegister/LoginAndRegister';
import ErrorPage from './components/ErrorPage/ErrorPage';
import HomePage from './components/HomePage/HomePage';



function App() {
	const { loggedIn } = useContext(LoggedinContext);
	
	function PrivateRoute({ element, loggedIn }) {
		return loggedIn ? element : <Navigate to="/" />;
	}
	
	return (
		<Routes>
			<Route path="/" element={<LoginAndRegister />} />
			<Route path="/home" element={<PrivateRoute element={<HomePage />} loggedIn={loggedIn} />} />
			<Route path="*" element={<ErrorPage />} />
		</Routes>
	);
}

export default App;
