import React, { useState, useEffect } from "react";
import "./ticket.scss";
import { TicketBearbeiten } from "./ticketBearbeiten";

export const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleEdit = (id) => {
    setSelectedTicketId(id);
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
            <button onClick={() => handleEdit(item.id)}>Beabrbeiten</button>
            {selectedTicketId === item.id && (
              <div className="ticket-bearbeiten-container">
                <TicketBearbeiten id={item.id} />
              </div>
            )}
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
