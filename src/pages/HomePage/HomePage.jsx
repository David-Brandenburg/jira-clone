import React, { useContext } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { LoggedinContext } from "../../context/loggedinContext";

const HomePage = () => {
  const { loggedIn } = useContext(LoggedinContext);
  console.log(loggedIn);

  return <Sidebar />;
};

export default HomePage;
