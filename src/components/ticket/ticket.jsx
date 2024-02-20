import React, { useState, useEffect } from "react";
import "./ticket.scss";
import { ToastContainer, toast } from "react-toastify";
import { TicketErstellen } from "./ticketErstellen";

export const Ticket = () => {
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

  const updateEditor = async (ticketId) => {
    const selectedUser = users.find((user) => user.id === benutzer);
    const ticket = tickets.find((ticket) => ticket.id === ticketId);

    if (selectedUser && ticket) {
      // Überprüfen, ob die Ticket-ID bereits im Benutzerprofil vorhanden ist
      if (!selectedUser.ticketId.includes(ticketId)) {
        const updatedUser = {
          ...selectedUser,
          ticketId: [...selectedUser.ticketId, ticketId], // Hinzufügen der neuen Ticket-ID
        };

        // Benutzerprofil aktualisieren
        const updateUserResponse = await fetch(`${url2}/${selectedUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        if (!updateUserResponse.ok) {
          throw new Error("Network response was not ok");
        }
      } else {
        console.log("Ticket ID already exists in user profile.");
      }
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const handelErstellen = () => {
    setErstellen(!erstellen);
  };

  const handleUpdateEditor = async (e, ticketId) => {
    e.preventDefault();
    updateEditor(ticketId);
    const selectedUser = users.find((user) => user.id === benutzer);
    if (selectedUser) {
      const optionsPatch = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editor: selectedUser.fname,
        }),
      };
      try {
        const response = await fetch(`${url}/${ticketId}`, optionsPatch);
        if (!response.ok) {
          throw new Error("Failed to update editor!", response.status);
        }
        toast.success("Editor erfolgreich aktualisiert!");
        fetchTickets(); // Tickets erneut abrufen, um die aktualisierten Daten anzuzeigen
      } catch (error) {
        toast.error("Editor konnte nicht aktualisiert werden!");
        console.error(error);
      }
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const response = await fetch(`${url}/${ticketId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete ticket!", response.status);
      }
      toast.success("Ticket erfolgreich gelöscht!");
      fetchTickets(); // Tickets erneut abrufen, um die aktualisierten Daten anzuzeigen
    } catch (error) {
      toast.error("Ticket konnte nicht gelöscht werden!");
      console.error(error);
    }
  };

  return (
    <div className="main">
      <ToastContainer />
      <div className="card2">
        <button
          className="erstellen-btn"
          onClick={() => handelErstellen(erstellen)}>
          Ticket erstellen
        </button>
        {erstellen && <TicketErstellen />}
      </div>
      <div className="ticket-container">
        {tickets?.map((ticket) => (
          <div className="ticket" key={ticket.id}>
            <div className="ticket-heading">
              <h2>{ticket.title}</h2>
              <p>{ticket.creator}</p>
              <p>{ticket.editor}</p>
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
              <button
                className="btn delete-btn"
                onClick={() => handleDeleteTicket(ticket.id)}>
                Löschen
              </button>
            </div>
            <h2>Benutzer zuordnen:</h2>
            <div>
              <select
                value={benutzer}
                onChange={(e) => setBenutzer(e.target.value)}
                className="select-benutzer">
                <option></option>
                {users?.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.fname}
                  </option>
                ))}
              </select>
              <button
                className="btn update-benutzer"
                onClick={(e) => handleUpdateEditor(e, ticket.id)}>
                Update Benutzer
              </button>
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
    </div>
  );
};
