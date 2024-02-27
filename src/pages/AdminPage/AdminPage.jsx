import { useState, useContext, useEffect } from "react";
import { generateRandomAvatar } from "../..";
import { ThemeContext } from "../../context/themeContext";
import { LoggedinContext } from "../../context/loggedinContext";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/defaultProfilepic.webp";
import "./adminpage.scss";

const AdminPage = () => {
  const [data, setData] = useState(null);
  const [dataToSave, setDataToSave] = useState({});
  const [dataToPatch, setDataToPatch] = useState({});
  const [entryData, setEntryData] = useState({});
  const [allUser, setAllUser] = useState([]);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [activeTab, setActiveTab] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedEditor, setSelectedEditor] = useState({
    name: "",
    id: "",
    avatar: "",
  });
  const [selectedEditEditor, setSelectedEditEditor] = useState({
    name: "",
    id: "",
    avatar: "",
  });

  const { theme } = useContext(ThemeContext);
  const { loggedInUser } = useContext(LoggedinContext);

  const dataBase = ["Users", "Tickets", "Log", "Placeholder"];

  const url = "http://localhost:5000/";
  const options = {
    method: "GET",
  };

  const fetchData = async (dataBase) => {
    const dataBaseName = dataBase.toLowerCase();
    try {
      const response = await fetch(`${url}${dataBaseName}`, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${dataBase}`);
      }
      const data = await response.json();
      // console.log(data);
      setData([dataBaseName, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEntry = async (id) => {
    try {
      const response = await fetch(`${url}${activeTab}/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch!", response.status);
      }
      const entryValue = await response.json();
      console.log(entryValue);
      setEntryData(entryValue);
    } catch (error) {
      console.error(error);
    }
  };

  (async () => {
    try {
      const resp = await fetch(`${url}users/${loggedInUser.userId}`, options);
      if (!resp.ok) {
        throw new Error("Failed to fetch!", resp.status);
      }
      const user = await resp.json();
      const userfname = user.fname;
      setCurrentUser(userfname);
    } catch (error) {
      console.error(error);
    }
  })();

  const handleOpenAddEntryModal = (parameter) => {
    if (!parameter || parameter === "placeholder") {
      toast.warn("You have to select a real table.");
      return;
    }
    setOpenModal(true);
  };

  const handleClass = (e) => {
    const listItems = document.querySelectorAll("li");
    const name = e.target.innerText.toLowerCase();

    e.target.classList.add("active");
    setActiveTab(name);
    setDataToSave({});

    listItems.forEach((listItem) => {
      if (listItem !== e.target) {
        listItem.classList.remove("active");
      }
    });
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      const resp = await fetch(url + "users", options);
      if (!resp.ok) {
        throw new Error("Failed to fetch!", resp.status);
      }
      const allUsers = await resp.json();
      // console.log(allUsers);
      setAllUser(allUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const avatar = selectedOption.getAttribute("data-avatar");
    setSelectedEditor({
      name: selectedOption.text,
      id: selectedOption.value,
      avatar: avatar,
    });
  };

  const handleEditEditorChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const avatar = selectedOption.getAttribute("data-avatar");
    setSelectedEditEditor({
      name: selectedOption.text,
      id: selectedOption.value,
      avatar: avatar,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll(".form-input");

    inputs.forEach((input) => {
      const value = input.type === "checkbox" ? input.checked : input.value;
      setDataToSave((prevData) => ({
        ...prevData,
        [input.name]: value,
      }));
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll(".form-input");

    inputs.forEach((input) => {
      const value = input.type === "checkbox" ? input.checked : input.value;
      setDataToPatch((prevData) => ({
        ...prevData,
        [input.name]: value,
      }));
    });
  };

  useEffect(() => {
    if (Object.keys(dataToSave).length !== 0) {
      postData(dataToSave);
    }
  }, [dataToSave]);

  useEffect(() => {
    if (Object.keys(dataToPatch).length !== 0) {
      patchData(dataToPatch);
    }
  }, [dataToPatch]);

  const patchData = async (object) => {
    const optionsPatchTicket = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: object.title,
        desc: object.desc,
        status: object.status,
        deadline: object.deadline,
        creator: object.creator,
        editor: selectedEditEditor.name || entryData.editor,
        editorId: selectedEditEditor.id || entryData.editorId,
        editorAvatar: selectedEditEditor.avatar || entryData.editorAvatar,
      }),
    };
    const optionsPatchUser = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: object.email,
        fname: object.fname,
        lname: object.lname,
        isadmin: object.isadmin,
      }),
    };

    try {
      if (activeTab === "users") {
        const response = await fetch(`${url}${activeTab}/${entryData.id}`, optionsPatchUser)
				if (!response.ok){
					throw new Error("Failed to fetch!", response.status)
				}
				toast.success(`Successfully changed entrys to user with Id: ${entryData.id}`);
				setOpenEditModal(false);
				setDataToPatch({});
				setEntryData({});
				fetchData(activeTab);
      } else if (activeTab === "tickets") {
				const ticketId = entryData.id;
				const selEditorId = selectedEditEditor.id;
        const resp = await fetch(`${url}${activeTab}/${ticketId}`, optionsPatchTicket);
        if (!resp.ok) {
          throw new Error("Failed to fetch!", resp.status);
        }
        toast.success(
          `Successfully changed entrys to ticket with Id: ${ticketId}`
        );
				const userResponse = await fetch("http://localhost:5000/users", {
					method: "GET",
				});
				if (!userResponse.ok) {
					throw new Error("Failed to fetch user data", userResponse.status);
				}
				const userData = await userResponse.json();

				const userToUpdate = userData.find((user) =>
					user.ticketIds.includes(ticketId)
				);
				if (userToUpdate){
					userToUpdate.ticketIds = userToUpdate.ticketIds.filter(
						(id) => id !== ticketId
					);
					const updateUserResponse = await fetch(
						`http://localhost:5000/users/${userToUpdate.id}`,
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

				const editorResponse = await fetch(`${url}users/${selEditorId}`);
        if (!editorResponse.ok) {
          throw new Error("Failed to fetch editor data", editorResponse.status);
        }
        const editorData = await editorResponse.json();
        editorData.ticketIds.push(ticketId);
        const updateEditorResponse = await fetch(`${url}users/${selEditorId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editorData),
        });
        if (!updateEditorResponse.ok) {
          throw new Error("Failed to update editor data", updateEditorResponse.status);
        }

        setOpenEditModal(false);
        setDataToPatch({});
				setEntryData({});
        fetchData(activeTab);
      }
    } catch (error) {
      console.error(error);
    }
    // console.log(object);
  };

  const postData = async (object) => {
    const optionsPostTicket = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: object.title,
        desc: object.desc,
        status: object.status,
        deadline: object.deadline,
        creator: object.creator,
        editor: selectedEditor.name,
        editorId: selectedEditor.id,
        editorAvatar: selectedEditor.avatar,
      }),
    };
    const optionsPostUser = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: object.email,
        fname: object.fname,
        lname: object.lname,
        password: object.password,
        avatar: avatar,
        ticketIds: [],
        isadmin: object.isadmin,
        isloggedin: false,
        id: Number,
      }),
    };

    try {
      if (activeTab === "users") {
        const respUsers = await fetch(`${url}users`, options);
        if (!respUsers.ok) {
          throw new Error("Failed to fetch!", respUsers.status);
        }
        const users = await respUsers.json();
        const checkUser = users.find((user) => user.email === object.email);
        if (checkUser) {
          toast.warn("E-Mail already in use!");
          setDataToSave({});
        } else {
          const postUser = await fetch(`${url}${activeTab}`, optionsPostUser);
          if (!postUser.ok) {
            throw new Error("Failed to fetch!", postUser.status);
          }
          toast.success("New user added!");
          setOpenModal(false);
          setDataToSave({});
          setAvatar(defaultAvatar);
          fetchData("users");
        }
      } else if (activeTab === "tickets") {
        const resp = await fetch(`${url}${activeTab}`, optionsPostTicket);
        if (!resp.ok) {
          throw new Error("Failed to fetch!", resp.status);
        }
        const newTicket = await resp.json();
        const ticketId = newTicket.id;
        const editorId = selectedEditor.id;
        const editorResponse = await fetch(`${url}users/${editorId}`);
        if (!editorResponse.ok) {
          throw new Error("Failed to fetch editor data", editorResponse.status);
        }
        const editorData = await editorResponse.json();
        editorData.ticketIds.push(ticketId);
        const updateEditorResponse = await fetch(`${url}users/${editorId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editorData),
        });
        if (!updateEditorResponse.ok) {
          throw new Error(
            "Failed to update editor data",
            updateEditorResponse.status
          );
        }

        toast.success("New ticket added!");
        setOpenModal(false);
        setDataToSave({});
        fetchData("tickets");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarChange = (e) => {
    e.preventDefault();
    const newVal = generateRandomAvatar();
    setAvatar(newVal);
  };

  const handleEditTicket = (e, id) => {
    e.preventDefault();
    setOpenEditModal(true);
    fetchEntry(id);
  };

  const handleDeleteTicket = async (e, ticketId) => {
    e.preventDefault();
    const urlDel = `http://localhost:5000/tickets/${ticketId}`;
    const optionsDel = {
      method: "DELETE",
    };

    try {
      const response = await fetch(urlDel, optionsDel);
      if (!response.ok) {
        throw new Error("Failed to delete ticket", response.status);
      }
      toast.success(`Successfully deleted ticket with Id: ${ticketId}`);
      const userResponse = await fetch("http://localhost:5000/users", {
        method: "GET",
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data", userResponse.status);
      }
      const userData = await userResponse.json();

      const userToUpdate = userData.find((user) =>
        user.ticketIds.includes(ticketId)
      );
      if (!userToUpdate) {
        throw new Error("User with ticketId not found");
      }
      userToUpdate.ticketIds = userToUpdate.ticketIds.filter(
        (id) => id !== ticketId
      );
      const updateUserResponse = await fetch(
        `http://localhost:5000/users/${userToUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToUpdate),
        }
      );

      if (!updateUserResponse.ok) {
        throw new Error(
          "Failed to update user data",
          updateUserResponse.status
        );
      }
      fetchData("tickets");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleEditUser = (e, id) => {
    e.preventDefault();
    console.log(id);
		setOpenEditModal(true);
		fetchEntry(id);
  };

  const handleDeleteUser = async (e, id) => {
    e.preventDefault();
    const urlDel = `${url}${activeTab}/${id}`;
    const optionsDel = {
      method: "DELETE",
    };

		try {
			const getUser = await fetch(`${url}${activeTab}/${id}`, options);
			if (!getUser.ok){
				throw new Error("Failed to fetch, couldnt find user!", getUser.status);
			}
			const gotUser = await getUser.json()
			const userTickets = gotUser.ticketIds;
			if (userTickets.length > 0){
				userTickets.forEach(ticketId => {
					changeDeletedUserTickets(ticketId);
				});
			};
			const deleteResp = await fetch(urlDel, optionsDel);
			if (!deleteResp.ok){
				throw new Error("Failed to fetch, user couldnt be deleted.", deleteResp.status)
			};
			fetchData(activeTab)
		} catch (error) {
			toast.error("Something went wrong!");
			console.error(error);
		}
  };

	const changeDeletedUserTickets = async (ticketId) => {
		const optionsPatchTicket = {
			method: "PATCH",
			headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editor: "",
        editorId: "",
        editorAvatar: "",
      }),
		}

		try {
			const respTicket = await fetch(`${url}tickets/${ticketId}`, optionsPatchTicket);
			if (!respTicket.ok){
				throw new Error("Failed to fetch!", respTicket.status)
			}
		} catch (error) {
			console.error(error);
		}
	} 

  return (
    <div className="main-content admin-page">
      <div className={`admin-wrapper ${theme}`}>
        <div className="admin-headnav">
          <ul>
            {dataBase.map((item, index) => (
              <li
                key={index}
                onClick={(e) => {
                  fetchData(e.target.innerText);
                  handleClass(e);
                }}>
                {item}
              </li>
            ))}
          </ul>
          <span
            className="addEntryBtn"
            onClick={() => {
              handleOpenAddEntryModal(activeTab);
            }}>
            <i className="bi bi-plus-square"></i>
          </span>
        </div>
        <div className="admin-content">
          {data && data[0] === "users" && (
            <table className="userTable">
              <thead>
                <tr>
                  {Object.keys(data[1][0]).map(
                    (key, index) =>
                      key !== "password" && (
                        <th key={index}>
                          {key === "isloggedin"
                            ? "STATUS"
                            : key === "fname"
                            ? "FIRSTNAME"
                            : key === "lname"
                            ? "LASTNAME"
                            : key.toUpperCase()}
                        </th>
                      )
                  )}
                  <th>Edit | Delete</th>
                </tr>
              </thead>
              <tbody>
                {data[1].map((item, index) => (
                  <tr key={index}>
                    {Object.entries(item).map(
                      ([key, value], index) =>
                        key !== "password" && (
                          <td
                            key={index}
                            style={{
                              color:
                                key === "isloggedin"
                                  ? value
                                    ? "green"
                                    : "red"
                                  : "inherit",
                            }}>
                            {key === "avatar" ? (
                              <img className={key} src={value} alt="Avatar" />
                            ) : key === "isloggedin" ? (
                              value ? (
                                "online"
                              ) : (
                                "offline"
                              )
                            ) : typeof value === "boolean" ? (
                              value.toString()
                            ) : typeof value === "object" ? (
                              value.length === 0 ? (
                                "N/A"
                              ) : value.length > 2 ? (
                                value.join(", ").slice(0, 17) + " ..."
                              ) : (
                                value.join(", ")
                              )
                            ) : (
                              value
                            )}
                          </td>
                        )
                    )}
                    <td>
                      <i
                        className="bi bi-pencil-square"
                        onClick={(e) => handleEditUser(e, item.id)}></i>
                      &nbsp;&nbsp; | &nbsp;&nbsp;
                      <i
                        className="bi bi-trash"
                        onClick={(e) => handleDeleteUser(e, item.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {data && data[0] === "tickets" && (
            <table className="ticketTable">
              <thead>
                <tr>
                  {Object.keys(data[1][0]).map(
                    (key, index) =>
                      key !== "desc" &&
                      key !== "editorAvatar" && (
                        <th key={index}>{key.toUpperCase()}</th>
                      )
                  )}
                  <th>Edit | Delete</th>
                </tr>
              </thead>
              <tbody>
                {data[1].map((item, index) => (
                  <tr key={index}>
                    {Object.entries(item).map(
                      ([key, value], index) =>
                        key !== "desc" &&
                        key !== "editorAvatar" && <td key={index}>{value}</td>
                    )}
                    <td>
                      <i
                        className="bi bi-pencil-square"
                        onClick={(e) => handleEditTicket(e, item.id)}></i>
                      &nbsp;&nbsp; | &nbsp;&nbsp;
                      <i
                        className="bi bi-trash"
                        onClick={(e) => handleDeleteTicket(e, item.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {data && data[0] === "log" && (
            <table className="ticketTable">
              <thead>
                <tr>
                  {Object.keys(data[1][0]).map((key, index) => (
                    <th key={index}>{key.toUpperCase()}</th>
                  ))}
                  <th>Edit | Delete</th>
                </tr>
              </thead>
              <tbody>
                {data[1].map((item, index) => (
                  <tr key={index}>
                    {Object.entries(item).map(
                      ([key, value], index) =>
                        key !== "desc" &&
                        key !== "editorAvatar" && <td key={index}>{value}</td>
                    )}
                    <td>
                      <i
                        className="bi bi-pencil-square"
                        onClick={(e) => handleEditTicket(e, item.id)}></i>
                      &nbsp;&nbsp; | &nbsp;&nbsp;
                      <i
                        className="bi bi-trash"
                        onClick={(e) => handleDeleteTicket(e, item.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {openModal && (
        <div
          className="addEntryModal-blocker"
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <form
            className="addEntryModal"
            onSubmit={(e) => {
              handleSubmit(e);
            }}>
            {activeTab === "users" && (
              <>
                <h2>Add User</h2>
                <div className="input-body">
                  <div className="input-left">
                    <div className="input-row">
                      <label htmlFor="fname">Firstname</label>
                      <input
                        className="form-input"
                        type="text"
                        name="fname"
                        id="fname"
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="lname">Lastname</label>
                      <input
                        className="form-input"
                        type="text"
                        name="lname"
                        id="lname"
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="email">E-Mail</label>
                      <input
                        className="form-input"
                        type="email"
                        name="email"
                        id="email"
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="password">Password</label>
                      <input
                        className="form-input"
                        type="password"
                        name="password"
                        id="password"
                        required
                      />
                    </div>
                    <div className="input-admin-row">
                      <label htmlFor="isadmin">isAdmin?</label>
                      <input
                        className="form-input"
                        type="checkbox"
                        name="isadmin"
                        id="isadmin"
                      />
                    </div>
                  </div>
                  <div className="input-right">
                    <div className="input-row">
                      <label htmlFor="">Avatar</label>
                      <img src={avatar} alt="" />
                      <button className="btn" onClick={handleAvatarChange}>
                        Change Avatar
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === "tickets" && (
              <>
                <h2>Add Ticket</h2>
                <div className="input-body">
                  <div className="input-left">
                    <div className="input-row">
                      <label htmlFor="title">Title</label>
                      <input
                        className="form-input"
                        type="text"
                        name="title"
                        id="title"
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="creator">Creator</label>
                      <input
                        className="form-input"
                        type="text"
                        name="creator"
                        id="creator"
                        defaultValue={currentUser}
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="editor">Editor</label>
                      <select
                        className="form-input"
                        name="editor"
                        id="editor"
                        required
                        onChange={handleEditorChange}>
                        <option defaultValue="" selected disabled>
                          Bitte auswählen:
                        </option>
                        {allUser.map((user, index) => (
                          <option
                            key={index}
                            value={user.id}
                            data-avatar={user.avatar}>
                            {user.fname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-row">
                      <label htmlFor="desc">Description</label>
                      <textarea
                        className="form-input"
                        name="desc"
                        id="desc"
                        maxLength={"500"}
                        required
                      />
                    </div>
                  </div>
                  <div className="input-right">
                    <div className="input-row">
                      <label htmlFor="deadline">Deadline</label>
                      <input
                        className="form-input"
                        type="date"
                        name="deadline"
                        id="deadline"
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="status">Status</label>
                      <select
                        className="form-input"
                        name="status"
                        id="status"
                        required>
                        <option defaultValue="" selected disabled>
                          Bitte auswählen:
                        </option>
                        <option value="TO DO">TO DO</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="IN REVIEW">IN REVIEW</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="input-btn-row">
              <button className="btn">
                Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setOpenModal(false);
                  setDataToSave({});
                  setAvatar(defaultAvatar);
                  toast.warn("Action canceled!");
                }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {openEditModal && (
        <div
          className="editEntryModal-blocker"
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <form
            className="editEntryModal"
            onSubmit={(e) => {
              handleEditSubmit(e);
            }}>
            {activeTab === "users" && (
              <>
                <h2>Add User</h2>
                <div className="input-body">
                  <div className="input-left">
                    <div className="input-row">
                      <label htmlFor="fname">Firstname</label>
                      <input
                        className="form-input"
                        type="text"
                        name="fname"
                        id="fname"
												defaultValue={entryData.fname}
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="lname">Lastname</label>
                      <input
                        className="form-input"
                        type="text"
                        name="lname"
                        id="lname"
												defaultValue={entryData.lname}
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="email">E-Mail</label>
                      <input
                        className="form-input"
                        type="email"
                        name="email"
                        id="email"
												defaultValue={entryData.email}
                        required
                      />
                    </div>
                    <div className="input-admin-row">
                      <label htmlFor="isadmin">isAdmin?</label>
                      <input
                        className="form-input"
                        type="checkbox"
                        name="isadmin"
                        id="isadmin"
												checked={entryData.isadmin}
												onChange={() => setEntryData(prevData => ({ ...prevData, isadmin: !prevData.isadmin }))}
                      />
                    </div>
                  </div>
                  <div className="input-right">
                    <div className="input-row">
                      <label htmlFor="">Avatar</label>
                      <img src={entryData.avatar} alt="" />
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === "tickets" && (
              <>
                <h2>
                  Edit Ticket with Id: <span>{entryData.id}</span>
                </h2>
                <div className="input-body">
                  <div className="input-left">
                    <div className="input-row">
                      <label htmlFor="title">Title</label>
                      <input
                        className="form-input"
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={entryData.title}
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="creator">Creator</label>
                      <input
                        className="form-input"
                        type="text"
                        name="creator"
                        id="creator"
                        defaultValue={entryData.creator}
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="editor">Editor</label>
                      <select
                        className="form-input"
                        name="editor"
                        id="editor"
                        required
                        onChange={handleEditEditorChange}>
                        <option
                          defaultValue={entryData.editor}
                          selected
                          disabled>
                          {entryData.editor}
                        </option>
                        {allUser.map((user, index) => (
                          <option
                            key={index}
                            value={user.id}
                            data-avatar={user.avatar}>
                            {user.fname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-row">
                      <label htmlFor="desc">Description</label>
                      <textarea
                        className="form-input"
                        name="desc"
                        id="desc"
                        maxLength={"500"}
                        defaultValue={entryData.desc}
                        required
                      />
                    </div>
                  </div>
                  <div className="input-right">
                    <div className="input-row">
                      <label htmlFor="deadline">Deadline</label>
                      <input
                        className="form-input"
                        type="date"
                        name="deadline"
                        id="deadline"
                        defaultValue={entryData.deadline}
                        required
                      />
                    </div>
                    <div className="input-row">
                      <label htmlFor="status">Status</label>
                      <select
                        className="form-input"
                        name="status"
                        id="status"
                        required>
                        <option
                          defaultValue={entryData.status}
                          selected
                          disabled>
                          {entryData.status}
                        </option>
                        <option value="TO DO">TO DO</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="IN REVIEW">IN REVIEW</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="input-btn-row">
              <button className="btn">
                Edit{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setOpenEditModal(false);
                  setDataToPatch({});
									setEntryData({});
                  toast.warn("Action canceled!");
                }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
