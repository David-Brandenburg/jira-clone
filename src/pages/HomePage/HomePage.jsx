import React, { useContext } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { LoggedinContext } from "../../context/loggedinContext";

const HomePage = () => {
  const { loggedIn, loggedInUser } = useContext(LoggedinContext);
  console.log(loggedIn);
  console.log(loggedInUser)

  return (
    <>
      <Sidebar />
    </>
  );
};

export default HomePage;
