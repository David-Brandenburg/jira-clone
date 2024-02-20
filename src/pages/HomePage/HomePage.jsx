import React, { useContext } from "react";
import { Ticket } from "../../components/ticket/ticket";
import { LoggedinContext } from "../../context/loggedinContext";
import "../main-content.scss";

const HomePage = () => {
  const { loggedIn, loggedInUser } = useContext(LoggedinContext);
  console.log(loggedIn);
  console.log(loggedInUser);

  return (
    <div className="main-content">
      <Ticket />
    </div>
  );
};

export default HomePage;
