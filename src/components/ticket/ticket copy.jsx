import { useState, useEffect } from "react";
import "./ticket2.scss";
import { ToastContainer, toast } from "react-toastify";
import { TicketErstellen } from "./ticketErstellen";

export const Ticket2 = () => {
  const [tickets, setTickets] = useState(null);
  const [users, setUsers] = useState(null);
  const [editTicket, setEditTicket] = useState(null);
  const [erstellen, setErstellen] = useState(false);
  const [benutzer, setBenutzer] = useState("");
  const url = `http://localhost:5000/tickets`;
  const url2 = `http://localhost:5000/users`;
  const optionsGet = {
    method: "GET",
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch(url, optionsGet);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      const fetchedTickets = await response.json();
      console.log("fetchedtickets:", fetchedTickets);
      setTickets(fetchedTickets);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(url2, optionsGet);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      const fetchedUsers = await response.json();
      console.log("fetchedusers:", fetchedUsers);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTicketEdit = async (ticketId) => {
    try {
      const response = await fetch(`${url}/${ticketId}`, optionsGet);
      if (!response.ok) {
        throw new Error("Failed to fetch ticket!", response.status);
      }
      const editTicket = await response.json();
      console.log("Editable Ticket:", editTicket);
      setEditTicket(editTicket);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitEditedTicket = async (e) => {
    e.preventDefault();
    const editedTitle = e.target.title.value;
    const editedDesc = e.target.description.value;
    const editedStatus = e.target.status.value;
    const editedDate = e.target.deadline.value;
    const ticketId = document.getElementById("ticketId").innerText;
    console.log(editedTitle, editedDesc, editedStatus, editedDate);
    try {
      const optionsPatch = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          desc: editedDesc,
          status: editedStatus,
          deadline: editedDate,
        }),
      };
      const response = await fetch(`${url}/${ticketId}`, optionsPatch);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      toast.success("Ticket erfolgreich bearbeitet!");
      setEditTicket(null);
      fetchTickets();
    } catch (error) {
      toast.error("Ticket konnte nicht gespeichert werden!");
      console.error(error);
    }
    console.log(ticketId);
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const handelErstellen = () => {
    setErstellen(!erstellen);
  };

  return (
    <div className="main">
      <ToastContainer />
      <div className="ticket-container">
        {tickets?.map((ticket) => (
          <div className="ticket" key={ticket.id}>
            <div className="ticket-heading">
              <h2>{ticket.title}</h2>
              <p>{ticket.id}</p>
              <p>{ticket.creator}</p>
            </div>
            <div className="ticket-description">
              <p>{ticket.desc}</p>
            </div>
            <div className="ticket-bottom">
              <div className="ticket-bottom-item">
                <h4>Status</h4>
                <p>{ticket.status}</p>
              </div>
              <div className="ticket-bottom-item">
                <h4>Fällig am:</h4>
                <p>{ticket.deadline}</p>
              </div>
            </div>
            <div className="ticket-buttons">
              <button
                className="btn edit-btn"
                onClick={() => handleTicketEdit(ticket.id)}>
                Bearbeiten
              </button>
            </div>
            <h2>Benutzer zuordnen:</h2>
            <div>
              <select>
                {users?.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.fname}
                  </option>
                ))}
              </select>
              <button>Update Benutzer</button>
            </div>
          </div>
        ))}
      </div>
      {editTicket && (
        <div
          className="blocker"
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <form
            className="edit-ticket-modal"
            onSubmit={(e) => {
              handleSubmitEditedTicket(e, editTicket.id);
            }}>
            <div className="ticket-heading">
              <input
                type="text"
                name="title"
                id="title"
                defaultValue={editTicket.title}
              />
              <p id="ticketId">{editTicket.id}</p>
              <p>{editTicket.creator}</p>
            </div>
            <div className="ticket-description">
              <textarea
                name="description"
                id="description"
                defaultValue={editTicket.desc}
              />
            </div>
            <div className="ticket-bottom">
              <div className="ticket-bottom-item">
                <h4>Status</h4>
                <select name="status" defaultValue={editTicket.status}>
                  <option value="Fertig">Fertig</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Nicht zugewiesen">Nicht zugewiesen</option>
                </select>
              </div>
              <div className="ticket-bottom-item">
                <h4>Fällig am:</h4>
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  defaultValue={editTicket.deadline}
                />
              </div>
            </div>
            <div className="ticket-buttons">
              <button type="submit" className="btn save-btn">
                Speichern
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => {
                  setEditTicket(null);
                  toast.warn("Ticket bearbeiten abgebrochen!");
                }}>
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="card2">
        <button
          className="erstellen-btn"
          onClick={() => handelErstellen(erstellen)}>
          Ticket erstellen
        </button>
        {erstellen && <TicketErstellen />}
      </div>
    </div>
  );
};
