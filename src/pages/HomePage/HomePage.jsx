import React, { useContext } from "react";
import { LoggedinContext } from "../../context/loggedinContext";

const HomePage = () => {
  const { loggedIn, loggedInUser } = useContext(LoggedinContext);
  console.log(loggedIn);
  console.log(loggedInUser)

  return (
    <div className="main-content">
    </div>
  );
};

export default HomePage;
