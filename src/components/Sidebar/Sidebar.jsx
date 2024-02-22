import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/themeContext";
import "./Sidebar.scss";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const backHome = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState(null);
  const [userCount, setUserCount] = useState([]);
  const [userloggedin, setuserloggedin] = useState();

  const url2 = `http://localhost:5000/users`;
  const optionsGet = {
    method: "GET",
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(url2, optionsGet);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      const fetchedUsers = await response.json();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const checkLogged = () => {
      if (users) {
        const userlogged = users.map((user) => user.isloggedin);
        setUserCount(userlogged);
      }
    };

    checkLogged();
  }, [users]); // Dieser useEffect reagiert nur auf Änderungen in 'users'

  useEffect(() => {
    // Berechnungen von 'userloggedin' hier durchführen, nachdem 'userCount' aktualisiert wurde
    if (userCount.length > 0) {
      const loggedinCount = userCount.filter((item) => item === true).length;
      setuserloggedin(loggedinCount);
    }
  }, [userCount]); // Dieser useEffect reagiert nur auf Änderungen in 'userCount'

  return (
    <aside className={theme === "light" ? "light" : "dark"}>
      <div
        className="aside-head-row"
        onClick={() => {
          backHome("/home");
        }}>
        <i className="bi bi-rocket-takeoff"></i>
        <div className="Überschrift-text">
          <h1>Clone Way</h1>
          <p>Software Project</p>
        </div>
      </div>
      <hr />
      <div className="aside-row">
        <h2>PLANNING</h2>
        <div className="icon-text">
          <i className="bi bi-list-nested"></i>
          <p>Roadmap</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-list-columns-reverse"></i>
          <p>Backlog</p>
        </div>
        <div
          className="icon-text kanban"
          onClick={() => {
            backHome("/KanBanBoard");
          }}>
          <i className="bi bi-border-all"></i>
          <p>Board</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-graph-up-arrow"></i>
          <p>Reports</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-view-list"></i>
          <p>Issues</p>
        </div>
      </div>
      <hr />
      <div className="aside-row">
        <h2>DEVELOPMENT</h2>
        <div className="icon-text">
          <i className="bi bi-code-slash"></i>
          <p>Code</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-view-stacked"></i>
          <p>Releases</p>
        </div>
      </div>
      <hr />
      <div className="aside-row">
        <h2>OPERATIONS</h2>
        <div className="icon-text">
          <i className="bi bi-cloud-arrow-up"></i>
          <p>Depolyments</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-telephone-x"></i>
          <p>Releases</p>
        </div>
      </div>
      <hr />
      <div className="aside-row online">
        <h2>Useres Online:</h2>
        <p>{userloggedin}</p>
      </div>
    </aside>
  );
};
