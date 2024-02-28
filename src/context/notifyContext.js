// NotifyContext.js
import { createContext, useState, useEffect } from "react";

export const NotifyContext = createContext();

export const NotifyContextProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [userIds, setUserIds] = useState(null);
  const [allTicketIds, setAllTicketIds] = useState(null);

  return (
    <NotifyContext.Provider
      value={{
        users,
        setUsers,
        userIds,
        setUserIds,
        allTicketIds,
        setAllTicketIds,
      }}>
      {children}
    </NotifyContext.Provider>
  );
};
