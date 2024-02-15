import React, { useState, useEffect } from "react";
import "./ticket.scss";
import { TicketBearbeiten } from "./ticketBearbeiten";

export const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [creator, setCreator] = useState(""); // Neue State-Variable für den ausgewählten Benutzer

  const handleEdit = (id) => {
    setSelectedTicketId((prevId) => (prevId === id ? null : id));
  };

  const updateCreator = async (id) => {
    const userResponse = await fetch(`http://localhost:5000/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const userData = await userResponse.json();
    const selectedUser = userData.find((user) => user.id === creator);
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        ticketId: [...selectedUser.ticketId, id],
      };

      const updateUserResponse = await fetch(
        `http://localhost:5000/users/${selectedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!updateUserResponse.ok) {
        throw new Error("Network response was not ok");
      }
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = (e, id) => {
    e.preventDefault();
    updateCreator(id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tickets-container">
      {tickets.map(function (item) {
        return (
          <div className="card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <p>{item.status}</p>
            <p>{item.deadline}</p>
            <p>{item.id}</p>
            <button onClick={() => handleEdit(item.id)}>
              {selectedTicketId === item.id ? "Abbrechen" : "Bearbeiten"}
            </button>
            {selectedTicketId === item.id && (
              <div className="ticket-bearbeiten-container">
                <TicketBearbeiten id={item.id} />
              </div>
            )}
            <h2>Benutzer zuordnen:</h2>
            <select
              value={creator}
              onChange={(e) => setCreator(e.target.value)}>
              <option value=""></option>
              <option value="1">danny</option>
              <option value="2">michelle</option>
              <option value="3">david</option>
            </select>
            <button onClick={(e) => handleSubmit(e, item.id)}>
              Update Creator
            </button>
          </div>
        );
      })}
      <div className="card">
        <a href="http://" target="_blank" rel="noopener noreferrer">
          <button>Ticket erstellen</button>
        </a>
      </div>
    </div>
  );
};
