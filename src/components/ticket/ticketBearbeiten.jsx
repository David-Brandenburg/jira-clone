import { useState } from "react";

export const TicketBearbeiten = ({ id }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [creator, setCreator] = useState("");

  const handleSubmit = async (e, fieldName) => {
    e.preventDefault();
    try {
      const inputValue = {
        title,
        desc,
        status,
        deadline,
        creator,
      };

      const response = await fetch(`http://localhost:5000/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [fieldName]: inputValue[fieldName] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(`${fieldName} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    }
  };

  return (
    <div className="form-card">
      <form>
        <h2>Title</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title?"
        />
        <button onClick={(e) => handleSubmit(e, "title")}>Update Title</button>

        <h2>Beschreibung</h2>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={(e) => handleSubmit(e, "desc")}>
          Update Description
        </button>

        <h2>Status</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Fertig">Fertig</option>
          <option value="In Progress">In Progress</option>
          <option value="Nicht zugewiesen">Nicht zugewiesen</option>
        </select>
        <button onClick={(e) => handleSubmit(e, "status")}>
          Update Status
        </button>

        <h2>Deadline</h2>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={(e) => handleSubmit(e, "deadline")}>
          Update Deadline
        </button>
      </form>
    </div>
  );
};
