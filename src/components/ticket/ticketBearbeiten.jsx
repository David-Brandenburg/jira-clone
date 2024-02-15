import { useState } from "react";

export const TicketBearbeiten = ({ id }) => {
  console.log(id);
  const [inputValues, setInputValues] = useState({
    title: "",
    desc: "",
    status: "",
    deadline: "",
    creator: "",
  });

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
      const response = await fetch(`http://localhost:5000/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Ticket created successfully");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return (
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
          name="creator"
          value={inputValues.creator}
          onChange={handleChange}>
          <option value=""></option>
          <option value="1">danny</option>
          <option value="2">michelle</option>
          <option value="3">david</option>
        </select>
        <button type="submit" className="btn">
          Bearbeitung Speichern
        </button>
      </form>
    </div>
  );
};
