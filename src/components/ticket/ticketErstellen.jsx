import { useState, useEffect } from "react";
import "./ticketErstellen.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TicketErstellen = () => {
  const [inputValues, setInputValues] = useState({
    title: "",
    desc: "",
    status: "",
    deadline: "",
    creator: "",
    editor: "",
  });
  const [benutzer, setBenutzer] = useState("");
  const [users, setUsers] = useState(null);
  const url2 = `http://localhost:5000/users`;
  const optionsGet = {
    method: "GET",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedUser = users.find((user) => user.id === benutzer);
    try {
      const editorContent = selectedUser.fname; // Hier wird der Editor-Inhalt mit dem Vornamen des ausgewählten Benutzers gefüllt

      const dataToSend = {
        ...inputValues, // Die bisherigen Eingabewerte
        editor: editorContent, // Den Inhalt des Editors
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
      toast.success("Ticket created successfully");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <h2>Title</h2>
          <input
            type="text"
            name="title"
            value={inputValues.title}
            onChange={handleChange}
            placeholder="Title?"
          />
          <h2>Beschreibung</h2>
          <input
            type="text"
            name="desc"
            value={inputValues.desc}
            onChange={handleChange}
          />
          <h2>Status</h2>
          <select
            name="status"
            value={inputValues.status}
            onChange={handleChange}>
            <option value="Fertig">Fertig</option>
            <option value="In Progress">In Progress</option>
            <option value="Nicht zugewiesen">Nicht zugewiesen</option>
          </select>
          <h2>Deadline</h2>
          <input
            type="date"
            name="deadline"
            value={inputValues.deadline}
            onChange={handleChange}
          />
          <h2>Benutzer zuordnen:</h2>
          <select
            value={benutzer}
            onChange={(e) => setBenutzer(e.target.value)}>
            <option>Bitte auswählen</option>
            {users?.map((user, index) => (
              <option key={index} value={user.id}>
                {user.fname}
              </option>
            ))}
          </select>
          <button type="submit" className="btn">
            Erstelle Ticket
          </button>
        </form>
      </div>
    </>
  );
};
