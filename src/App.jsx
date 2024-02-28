import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LoggedinContext } from "./context/loggedinContext";
import { ThemeContext } from "./context/themeContext.js";
import LoginAndRegister from "./components/LoginRegister/LoginAndRegister";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Navbar from "./components/Navigationbar/Navbar.jsx";
import { Sidebar } from "./components/Sidebar/Sidebar.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import { KanBanBoard } from "./pages/KanBanPage/KanBanBoard.jsx";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loggedIn, isAdmin } = useContext(LoggedinContext);
	const { theme } = useContext(ThemeContext);
	const navigate = useNavigate();

  // useEffect(() => {
  //   if (loggedIn) {
  //     window.onload = () => {
  //       navigate('/home');
  //     };
  //   }
  // }, [loggedIn, navigate]);

  function PrivateRoute({ element, loggedIn }) {
    return loggedIn ? element : <Navigate to="/" />;
  }

  function AdminRoute({ element, loggedIn, isAdmin }) {
    return loggedIn && isAdmin ? element : <ErrorPage />;
  }

  return (
		<div className="main">
			<ToastContainer theme={theme} pauseOnFocusLoss={false} pauseOnHover={false} autoClose={3000}/>
      {loggedIn && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <Routes>
        <Route path="/" element={<LoginAndRegister />} />
        <Route path="/home" element={<PrivateRoute element={<HomePage />} loggedIn={loggedIn} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} loggedIn={loggedIn} />} />
        <Route path="/admin" element={ <AdminRoute element={<AdminPage />} loggedIn={loggedIn} isAdmin={isAdmin}/> } />
        <Route path="/kanBanBoard" element={<PrivateRoute element={<KanBanBoard />} loggedIn={loggedIn} /> } />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
