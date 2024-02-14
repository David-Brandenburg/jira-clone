import React, { useState, useEffect } from "react";
import "./ticket.scss";

export const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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
