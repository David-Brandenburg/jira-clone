import React, { useState, useEffect, useContext } from "react";
import "./ticket.scss";
import { toast } from "react-toastify";
import { LoggedinContext } from "../../context/loggedinContext";
import { ThemeContext } from "../../context/themeContext";
import { currentDateTime } from "../..";

export const Ticket = () => {
  const [tickets, setTickets] = useState(null);
  const [users, setUsers] = useState(null);
  const [editTicket, setEditTicket] = useState(null);
  const [erstellen, setErstellen] = useState(false);
  const [benutzer, setBenutzer] = useState("");
  const [creator, setCreator] = useState(null);
  const [inputValues, setInputValues] = useState({
    title: "",
    desc: "",
    status: "",
    deadline: "",
    creator: "",
    editor: "",
    editorId: "",
    editorAvatar: "",
  });

  const { loggedInUser, isAdmin, isManager } = useContext(LoggedinContext);
  const { theme } = useContext(ThemeContext);
  const [showEditor, setShowEditor] = useState(false);

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

      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  (async () => {
    try {
      const findCurrentUser = await fetch(
        `${url2}/${loggedInUser.userId}`,
        optionsGet
      );
      if (!findCurrentUser.ok) {
        throw new Error(
          "Failed to fetch, User not found!",
          findCurrentUser.status
        );
      }
      const currentUser = await findCurrentUser.json();
      setCreator(currentUser.fname);
    } catch (error) {
      console.error(error);
    }
  })();

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
    const ticketId2 = document.getElementById("ticketId").innerText;
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
      const response = await fetch(`${url}/${ticketId2}`, optionsPatch);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      toast.success("Ticket erfolgreich bearbeitet!");
      setEditTicket(null);
      fetchTickets();
      postLog(loggedInUser.userId, `Ticket '${ticketId2}' wurde bearbeitet.`);
    } catch (error) {
      toast.error("Ticket konnte nicht gespeichert werden!");
      console.error(error);
    }
    console.log(ticketId2);
  };

	const updateEditor = async (ticketId) => {
		try {
			const selectedUser = users.find((user) => user.id === benutzer);
			const ticket = tickets.find((ticket) => ticket.id === ticketId);
			const userToUpdate = users.find((user) => user.ticketIds.includes(ticketId));
	
			if (selectedUser && ticket) {
				if (!selectedUser.ticketIds.includes(ticketId)) {
					const updatedSelectedUser = {
						...selectedUser,
						ticketIds: [...selectedUser.ticketIds, ticketId]
					};
					await updateUser(updatedSelectedUser);
				} else {
					console.log("Ticket ID ist bereits dem Benutzer zugewiesen.");
				}
			}

			if (userToUpdate && userToUpdate.id !== selectedUser.id) {
				const updatedUserToUpdate = {
					...userToUpdate,
					ticketIds: userToUpdate.ticketIds.filter(id => id !== ticketId)
				};
				await updateUser(updatedUserToUpdate);
				postLog(loggedInUser.userId, `Ticket '${ticketId}' wurde dem Benutzer ${selectedUser.id} (${selectedUser.fname}) zugewiesen.`);
				fetchTickets();
				fetchUsers();
				setBenutzer("");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const updateUser = async (updatedUser) => {
		const updateUserResponse = await fetch(`${url2}/${updatedUser.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedUser),
		});
	
		if (!updateUserResponse.ok) {
			throw new Error("Network response was not ok");
		}
		fetchTickets();
		fetchUsers();
		setBenutzer("");
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
          editorId: selectedUser.id,
          editorAvatar: selectedUser.avatar,
        }),
      };
      try {
        const response = await fetch(`${url}/${ticketId}`, optionsPatch);
        if (!response.ok) {
          throw new Error("Failed to update editor!", response.status);
        }
        toast.success("Editor erfolgreich aktualisiert!");
        fetchTickets();
      } catch (error) {
        toast.error("Editor konnte nicht aktualisiert werden!");
        console.error(error);
      }
    }
  };

  const updateUserTicketId = async (ticketId) => {
    try {
      const userToUpdate = users.find((user) => user.ticketIds.includes(ticketId));
			if (userToUpdate) {
				userToUpdate.ticketIds = userToUpdate.ticketIds.filter((id) => id !== ticketId);
				const updateUserResponse = await fetch(`${url2}/${userToUpdate.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(userToUpdate),
					}
				);
				if (!updateUserResponse.ok) {
					throw new Error("Failed to update user data", updateUserResponse.status);
				}
			}
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
			const response = await fetch(`${url}/${ticketId}`, { method: "DELETE" });
      if (!response.ok) {
				throw new Error("Failed to delete ticket!", response.status);
      }
      toast.success(`Ticket '${ticketId}' erfolgreich gelöscht!`);

			updateUserTicketId(ticketId)
			postLog(loggedInUser.userId, `Ticket '${ticketId}' wurde gelöscht.`)
      fetchTickets();
    } catch (error) {
      toast.error(`Ticket '${ticketId}' konnte nicht gelöscht werden!`);
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...inputValues, // Die bisherigen Eingabewerte
        creator: creator,
      };

      const response = await fetch("http://localhost:5000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newTicket = await response.json();
      toast.success("Ticket created successfully");
      setErstellen(false);
      fetchTickets();
      // saveErstellDatum(loggedInUser.userId, newTicket.id);
      postLog(loggedInUser.userId, `Ticket '${newTicket.id}' wurde erstellt.`);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleMouseEnter = () => {
    setShowEditor(true);
  };

  const handleMouseLeave = () => {
    setShowEditor(false);
  };

	const postLog = async (userId, message) => {
		try {
      const dateTime = currentDateTime();
      const respLog = await fetch(`http://localhost:5000/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          date: dateTime.date,
          time: dateTime.time,
          status: message
        }),
      });
      if (!respLog.ok) {
        throw new Error("Failed to set Date or Time", respLog.status);
      }
      console.log("Date and time saved to database successfully");
    } catch (error) {
      console.error(error);
    }
	}

  return (
    <>
      <div className="card2">
        <button
          className="erstellen-btn"
          onClick={() => handelErstellen(erstellen)}>
          {erstellen ? "zurück" : "Ticket erstellen"}
        </button>
        {erstellen && (
          <div
            className="blocker"
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <form className="edit-ticket-modal">
              <div className="ticket-heading">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={inputValues.title}
                  onChange={handleChange}
                />
                <p id="ticketId"></p>
                <p></p>
              </div>
              <div className="ticket-description">
                <textarea
                  name="desc"
                  id="description"
                  value={inputValues.desc}
                  onChange={handleChange}
                />
              </div>
              <div className="ticket-bottom">
                <div className="ticket-bottom-item">
                  <h4>Status</h4>
                  <select
                    name="status"
                    value={inputValues.status}
                    onChange={handleChange}>
                    <option>Bitte auswählen</option>
                    <option value="TO DO">TO DO</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="IN REVIEW">IN REVIEW</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
                <div className="ticket-bottom-item">
                  <h4>Fällig am:</h4>
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    value={inputValues.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="ticket-buttons">
                <button
                  type="submit"
                  className="btn"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}>
                  Erstelle Ticket
                </button>

                <button
                  className="btn cancel-btn"
                  onClick={() => {
                    toast.warn("Ticket bearbeiten abgebrochen!");
                  }}>
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="ticket-container">
        {tickets?.map((ticket) => (
          <div className={`ticket ${theme}`} key={ticket.id}>
            <div className="ticket-heading">
              <h2>{ticket.title}</h2>
              <p>Creator: {ticket.creator}</p>
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
                <h4>Status</h4>
                <p>{ticket.status}</p>
              </div>
              <div className="ticket-bottom-item">
                <h4>Fällig am:</h4>
                <p>{ticket.deadline}</p>
              </div>
            </div>
            {(isManager || isAdmin) && (
              <>
                <div className="ticket-buttons">
                  <button className="btn edit-btn" onClick={() => handleTicketEdit(ticket.id)}> Bearbeiten</button>
                  <button className="btn delete-btn" onClick={() => {handleDeleteTicket(ticket.id)}}>Löschen</button>
                </div>
                <h2>Benutzer zuordnen:</h2>
                <div>
                  <select value={benutzer} onChange={(e) => setBenutzer(e.target.value)} className="select-benutzer">
                    <option>Bitte auswählen</option>
                    {users?.map((user, index) => (
                      <option key={index} value={user.id}>
                        {user.fname}
                      </option>
                    ))}
                  </select>
                  <button className="btn update-benutzer" onClick={(e) => {handleUpdateEditor(e, ticket.id)}}>Update Benutzer</button>
                </div>
              </>
            )}
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
                <select
                  name="status"
                  value={inputValues.status}
                  onChange={handleChange}>
                  <option>Bitte auswählen</option>
                  <option value="TO DO">TO DO</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="IN REVIEW">IN REVIEW</option>
                  <option value="DONE">DONE</option>
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
    </>
  );
};
