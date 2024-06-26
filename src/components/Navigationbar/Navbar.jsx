import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoggedinContext } from "../../context/loggedinContext";
import { ThemeContext } from "../../context/themeContext";
import search_icon_light from "../../assets/search-w.png";
import search_icon_dark from "../../assets/search-b.png";
import toggle_light from "../../assets/day.png";
import toggle_dark from "../../assets/night.png";
import { currentDateTime } from "../..";
import "./Navbar.scss";

const Navbar2 = () => {
  const {
    loggedInUser,
    setLoggedIn,
    setLoggedInUser,
    setStayLoggedIn,
    isAdmin,
  } = useContext(LoggedinContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleProfileMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const logout = async (loggedInUserId) => {
    const url = `http://localhost:5000/users/${loggedInUserId}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isloggedin: false,
      }),
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to fetch", response.status);
      }
      toast.success("You're getting logged out!");
      setTimeout(() => {
        setLoggedIn(false);
        setStayLoggedIn(false);
        setLoggedInUser(null);
        navigate("/");
      }, 3000);
      saveloggedOutTime(loggedInUserId);
    } catch (error) {
      console.error(error);
    }
    console.log("Logout", url);
  };

  const saveloggedOutTime = async (userId) => {
    try {
      const dateTime = currentDateTime();
      const respLog = await fetch(`http://localhost:5000/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          date: dateTime.date,
          time: dateTime.time,
          status: "logout",
        }),
      });
      if (!respLog.ok) {
        throw new Error("Failed to set Date or Time", respLog.status);
      }
      console.log("Date and time saved to database successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav>
        <div className={`nav-wrapper ${theme}`}>
          <div className="toggle-wrapper">
            <img
              src={theme === "light" ? toggle_dark : toggle_light}
              alt=""
              onClick={toggleTheme}
            />
          </div>
          <div className="item-wrapper">
            <ul className="nav-links">
              <li>Your Work</li>
              <li>Projects</li>
              <li>Filters</li>
              <li>Dashboards</li>
              <li>Teams</li>
              <li>Plans</li>
              <li>Apps</li>
            </ul>
            <div className="search-wrapper">
              <input type="text" name="search" id="search" />
              <img
                src={theme === "light" ? search_icon_dark : search_icon_light}
                alt=""
              />
            </div>
            <div className="profile-wrapper">
              <div className="profile-avatar" onClick={toggleProfileMenu}>
                <img src={loggedInUser?.avatar} alt="" />
              </div>
              <div
                className="profile-menu"
                style={{ visibility: showMenu ? "visible" : "hidden" }}>
                <p>Placeholder</p>
                <p
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}>
                  Profil
                </p>
                {isAdmin === true && (
                  <p
                    onClick={() => {
                      navigate("/admin");
                      setShowMenu(false);
                    }}>
                    Admin Page
                  </p>
                )}
                <p
                  onClick={() => {
                    logout(loggedInUser.userId);
                    setShowMenu(false);
                  }}>
                  Ausloggen
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar2;
