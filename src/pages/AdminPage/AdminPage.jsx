import { useState, useContext, useEffect } from "react"
import { generateRandomAvatar } from '../..';
import { ThemeContext } from "../../context/themeContext";
import { LoggedinContext } from "../../context/loggedinContext";
import "./adminpage.scss"
import { ToastContainer, toast } from "react-toastify";
import defaultAvatar from "../../assets/defaultProfilepic.webp"

const AdminPage = () => {
	const [data, setData] = useState(null);
	const [dataToSave, setDataToSave] = useState({});
	const [allUser, setAllUser] = useState([])
	const [avatar, setAvatar] = useState(defaultAvatar);
	const [activeTab, setActiveTab] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [selectedEditor, setSelectedEditor] = useState({ name: '', id: '' });
	const { theme } = useContext(ThemeContext);
	const {loggedInUser} = useContext(LoggedinContext);
	const dataBase = ["Users", "Tickets", "Placeholder", "Placeholder"];
	const url = "http://localhost:5000/"
	const options = {
		method: "GET",
	};

	const fetchData = async (dataBase) => {
		const dataBaseName = dataBase.toLowerCase();
		try {
			const response = await fetch(`${url}${dataBaseName}`, options);
			if (!response.ok){
				throw new Error(`Failed to fetch data from ${dataBase}`);
			};
			const data = await response.json();
			console.log(data)
			setData([dataBaseName, data]);
		} catch (error) {
			console.error(error);
		};
	};

	(async () => {
		try {
			const resp = await fetch(`${url}users/${loggedInUser.userId}`, options)
			if (!resp.ok){
				throw new Error("Failed to fetch!", resp.status)
			}
			const user = await resp.json()
			const userfname = user.fname;
			setCurrentUser(userfname)
		} catch (error) {
			console.error(error)
		}
	})();

	const handleOpenAddEntryModal = (parameter) => {
		if(!parameter){
			return
		}
		setOpenModal(true);
	}

	const handleClass = (e) => {
		const listItems = document.querySelectorAll("li");
		const name = e.target.innerText.toLowerCase();

		e.target.classList.add("active")
		setActiveTab(name);
		setDataToSave({})

		listItems.forEach((listItem) => {
			if(listItem !== e.target){
				listItem.classList.remove("active")
			}
		})
		fetchUsers();
	}

	const fetchUsers = async () => {
		try {
			const resp = await fetch(url+"users", options)
			if (!resp.ok){
				throw new Error("Failed to fetch!", resp.status)
			}
			const allUsers = await resp.json();
			console.log(allUsers)
			setAllUser(allUsers);
		} catch (error) {
			console.error(error);
		}
	}

	const handleEditorChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedEditor({
            name: selectedOption.text,
            id: selectedOption.value
        });
    };

	const handleSubmit = (e) => {
		e.preventDefault();
		const inputs = e.target.querySelectorAll(".form-input");

		inputs.forEach(input => {
			const value = input.type === 'checkbox' ? input.checked : input.value;
			setDataToSave(prevData => ({
				...prevData,
				[input.name]: value
			}));
		});
	}

	useEffect(() => {
		if (Object.keys(dataToSave).length !== 0) {
			postData(dataToSave);
		}
	}, [dataToSave]);

	const postData = async (object) => {
		const optionsPostTicket = {
			method: "POST",
			headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": object.title,
                "desc": object.desc,
                "status": object.status,
                "deadline": object.deadline,
                "creator": object.creator,
                "editor": selectedEditor.name,
                "editorId": selectedEditor.id,
            })
		};
		const optionsPostUser = {
			method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": object.email,
                "fname": object.fname,
                "lname": object.lname,
                "password": object.password,
                "avatar": avatar,
                "ticketId": [],
                "isadmin": object.isadmin,
                "isloggedin": false,
				"id": Number,
            })
		};

		try {
			if (activeTab === "users"){
				const respUsers = await fetch(`${url}users`, options)
				if (!respUsers.ok){
					throw new Error("Failed to fetch!", respUsers.status)
				}
				const users = await respUsers.json();
				const checkUser = users.find(user => user.email === object.email)
				if (checkUser){
					toast.warn("E-Mail already in use!")
					setDataToSave({})
				} else {
					const postUser = await fetch(`${url}${activeTab}`, optionsPostUser)
					if (!postUser.ok){
						throw new Error("Failed to fetch!", postUser.status)
					}
					toast.success("New user added!")
					setOpenModal(false)
					setDataToSave({})
					setAvatar(defaultAvatar)
					fetchData("users")
				}
			} else {
				const resp = await fetch(`${url}${activeTab}`, optionsPostTicket)
				if (!resp.ok){
					throw new Error("Failed to fetch!", resp.status)
				}
				toast.success("New ticket added!")
				setOpenModal(false)
				setDataToSave({})
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleAvatarChange = (e) => {
		e.preventDefault();
		const newVal = generateRandomAvatar();
		setAvatar(newVal);
	}

	return (
		<div className="main-content admin-page">
			<ToastContainer />
			<div className={`admin-wrapper ${theme}`}>
				<div className="admin-headnav">
					<ul>
						{dataBase.map((item, index) => (
							<li key={index} onClick={((e) => {fetchData(e.target.innerText); handleClass(e)})}>{item}</li>
						))}
					</ul>
					<span className="addEntryBtn" onClick={(() => {handleOpenAddEntryModal(activeTab)})}><i className="bi bi-plus-square"></i></span>
				</div>
				<div className="admin-content">
					{data && data[0] === "users" && (
						<table className="userTable">
							<thead>
								<tr>
									{Object.keys(data[1][0]).map((key, index) => (
										key !== "password" && (
											<th key={index}>{key.toUpperCase()}</th>
										)
									))}
								</tr>
							</thead>
							<tbody>
								{data[1].map((item, index) => (
									<tr key={index}>
										{Object.entries(item).map(([key, value], index) => (
											key !== "password" && (
												<td key={index}>
													{key === "avatar" ? (
														<img className={key} src={value} alt="Avatar" />
													) : (
														typeof(value) === "boolean"
															? value.toString()
															: typeof(value) === "object"
															? (value.length === 0 ? "N/A" : value.join(", "))
															: value
													)}
												</td>
											)
										))}
									</tr>
								))}
							</tbody>
						</table>
					)}
					{data && (data[0] === "tickets" && (
						<table className="ticketTable">
							<thead>
								<tr>
									{Object.keys(data[1][0]).map((key, index) => (
										key !== "desc" && (
											<th key={index}>{key.toUpperCase()}</th>
										)
									))}
									<th>Edit / Delete</th>
								</tr>
							</thead>
							<tbody>
								{data[1].map((item, index) => (
									<tr key={index}>
										{Object.entries(item).map(([key, value], index) => (
											key !== "desc" && (
												<td key={index}>{value}</td>
											)
										))}
										<td><i class="bi bi-pencil-square"></i>&nbsp;&nbsp; | &nbsp;&nbsp;<i class="bi bi-trash"></i></td>
									</tr>
								))}
							</tbody>
						</table>
						)
					)}
				</div>
			</div>
			{openModal &&
				<div className="addEntryModal-blocker" onClick={(e) => {e.stopPropagation()}}>
					<form className="addEntryModal" onSubmit={((e) => {handleSubmit(e)})}>
						{activeTab === "users" && (
							<>
								<h2>Add User</h2>
								<div className="input-body">
									<div className="input-left">
										<div className="input-row">
											<label htmlFor="fname">Firstname</label>
											<input className="form-input" type="text" name="fname" id="fname" required/>
										</div>
										<div className="input-row">
											<label htmlFor="lname">Lastname</label>
											<input className="form-input" type="text" name="lname" id="lname" required/>
										</div>
										<div className="input-row">
											<label htmlFor="email">E-Mail</label>
											<input className="form-input" type="email" name="email" id="email" required/>
										</div>
										<div className="input-row">
											<label htmlFor="password">Password</label>
											<input className="form-input" type="password" name="password" id="password" required/>
										</div>
										<div className="input-admin-row">
											<label htmlFor="isadmin">isAdmin?</label>
											<input className="form-input" type="checkbox" name="isadmin" id="isadmin" />
										</div>
									</div>
									<div className="input-right">
										<div className="input-row">
											<label htmlFor="">Avatar</label>
											<img src={avatar} alt="" />
											<button className="btn" onClick={handleAvatarChange}>Change Avatar</button>
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
											<input className="form-input" type="text" name="title" id="title" required/>
										</div>
										<div className="input-row">
											<label htmlFor="creator">Creator</label>
											<input className="form-input" type="text" name="creator" id="creator" defaultValue={currentUser} required/>
										</div>
										<div className="input-row">
											<label htmlFor="editor">Editor</label>
											<select className="form-input" name="editor" id="editor" required onChange={handleEditorChange}>
												<option defaultValue="" selected disabled>Bitte auswählen:</option>
												{allUser.map((user, index) => (
													<option key={index} value={user.id}>{user.fname}</option>
												))}
											</select>
										</div>
										<div className="input-row">
											<label htmlFor="desc">Description</label>
											<textarea className="form-input" name="desc" id="desc" maxLength={"500"} required/>
										</div>
									</div>
									<div className="input-right">
										<div className="input-row">
											<label htmlFor="deadline">Deadline</label>
											<input className="form-input" type="date" name="deadline" id="deadline" required/>
										</div>
										<div className="input-row">
											<label htmlFor="status">Status</label>
											<select className="form-input" name="status" id="status" required>
												<option defaultValue="" selected disabled>Bitte auswählen:</option>
												<option value="Nicht zugewiesen">Nicht zugewiesen</option>
												<option value="In Progress">In Progress</option>
												<option value="Fertig">Fertig</option>
											</select>
										</div>
									</div>
								</div>
							</>
						)}
						<div className="input-btn-row">
							<button className="btn">Add {activeTab.charAt(0).toUpperCase()+activeTab.slice(1, -1)}</button>
							<button className="btn" onClick={(() => {setOpenModal(false); setDataToSave({}); setAvatar(defaultAvatar)})}>Cancel</button>
						</div>
					</form>
				</div>
			}
		</div>
	)
}

export default AdminPage