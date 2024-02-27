import { createContext, useEffect, useState } from "react";

export const LoggedinContext = createContext();

export const LoggedinContextProvider = ({ children }) => {
  const [stayLoggedIn, setStayLoggedIn] = useState(
    localStorage.getItem("stayLoggedIn") === "true" ? true : false
  );
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("admin") === "true" ? true : false
  );
  const [loggedIn, setLoggedIn] = useState(
    stayLoggedIn
      ? localStorage.getItem("loggedIn") === "true"
        ? true
        : false
      : false
  );
  const storedLoggedInUser = localStorage.getItem("loggedInUser");
  const [loggedInUser, setLoggedInUser] = useState(
    loggedIn
      ? storedLoggedInUser
        ? JSON.parse(storedLoggedInUser)
        : null
      : null
  );

  useEffect(() => {
    localStorage.setItem("stayLoggedIn", stayLoggedIn);
  }, [stayLoggedIn]);

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedIn) {
      (async () => {
        const url = `http://localhost:5000/users/${loggedInUser.userId}`;
        const options = {
          method: "GET",
        };
        try {
          const resp = await fetch(url, options);
          if (!resp.ok) {
            throw new Error("Failed to fetch!", resp.status);
          }
          const user = await resp.json();

          if (user.isadmin === true) {
            sessionStorage.setItem("admin", true);
            setIsAdmin(true);
          } else {
            sessionStorage.setItem("admin", false);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [loggedIn, loggedInUser, setIsAdmin]);

  console.log(loggedInUser);

  return (
    <LoggedinContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        setStayLoggedIn,
        loggedInUser,
        setLoggedInUser,
        isAdmin,
        setIsAdmin,
      }}>
      {children}
    </LoggedinContext.Provider>
  );
};
