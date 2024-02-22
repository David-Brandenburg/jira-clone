import React, { useState, useEffect } from "react";
import "./KanBanBoard.scss";

export const KanBanBoard = () => {
  const [tickets, setTickets] = useState(null);
  const url = `http://localhost:5000/tickets`;
  const optionsGet = {
    method: "GET",
  };
  const [showEditor, setShowEditor] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await fetch(url, optionsGet);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      const fetchedTickets = await response.json();

      setTickets(fetchedTickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleMouseEnter = () => {
    setShowEditor(true);
  };

  const handleMouseLeave = () => {
    setShowEditor(false);
  };

  const renderTicketsByStatus = (status) => {
    const filteredTickets = tickets?.filter(
      (ticket) => ticket.status === status
    );
    return filteredTickets?.map((ticket) => (
      <div className="ticket KanBanticket" key={ticket.id}>
        <div className="ticket-heading">
          <p>Editor: {ticket.editor}</p>
          <div
            className="ticket-editor-pic"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <img src={ticket.editorAvatar} alt="Editor Avatar" />
            {showEditor && <div className="tooltip">{ticket.editor}</div>}
          </div>
        </div>
        <div className="ticket-description">
          <p>{ticket.desc}</p>
        </div>
        <div className="ticket-bottom">
          <div className="ticket-bottom-item">
            <h4>Fällig am:</h4>
            <p>{ticket.deadline}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="main-content">
      <table>
        <thead>
          <tr>
            <th>TO DO</th>
            <th>IN PROGRESS</th>
            <th>IN REVIEW</th>
            <th>DONE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {tickets && tickets.length > 0 && (
                <div className="ticket-container KanBanticket">
                  {renderTicketsByStatus("TO DO")}
                </div>
              )}
            </td>
            <td>
              {tickets && tickets.length > 0 && (
                <div className="ticket-container KanBanticket">
                  {renderTicketsByStatus("IN PROGRESS")}
                </div>
              )}
            </td>
            <td>
              {tickets && tickets.length > 0 && (
                <div className="ticket-container KanBanticket">
                  {renderTicketsByStatus("IN REVIEW")}
                </div>
              )}
            </td>
            <td>
              {tickets && tickets.length > 0 && (
                <div className="ticket-container KanBanticket">
                  {renderTicketsByStatus("DONE")}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
