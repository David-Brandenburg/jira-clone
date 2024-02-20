import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { LoggedinContext } from "./context/loggedinContext";
import LoginAndRegister from "./components/LoginRegister/LoginAndRegister";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Navbar from "./components/Navigationbar/Navbar.jsx";
import { Sidebar } from "./components/Sidebar/Sidebar.jsx";

function App() {
  const { loggedIn } = useContext(LoggedinContext);

  function PrivateRoute({ element, loggedIn }) {
    return loggedIn ? element : <Navigate to="/" />;
  }

  return (
    <div className="main">
		{loggedIn &&
			<>
				<Navbar />
				<Sidebar />
			</>
		}
		<Routes>
			<Route path="/" element={<LoginAndRegister />} />
			<Route
				path="/home"
				element={<PrivateRoute element={<HomePage />} loggedIn={loggedIn} />}
			/>
			<Route path="*" element={<ErrorPage />} />
		</Routes>
    </div>
  );
}

export default App;