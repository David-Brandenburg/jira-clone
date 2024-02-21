import { useState, useContext } from "react"
import { generateRandomAvatar } from '../..';
import { ThemeContext } from "../../context/themeContext";
import { LoggedinContext } from "../../context/loggedinContext";
import "./adminpage.scss"

const AdminPage = () => {
	const [data, setData] = useState(null);
	const [activeTab, setActiveTab] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
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
			const resp = await fetch(`${url}users/${loggedInUser.userId}`)
			if (!resp.ok){
				throw new Error("Failed to fetch!", resp.status)
			}
			const user = await resp.json()
			const userfname = user.fname;
			setCurrentUser(userfname)
		} catch (error) {
			console.error(error)
		}
	})()

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

		listItems.forEach((listItem) => {
			if(listItem !== e.target){
				listItem.classList.remove("active")
			}
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const inputs = e.target.querySelectorAll("input:not([type='checkbox'])");
		const inputCheckbox = e.target.querySelector("input[type='checkbox']")

		if (inputCheckbox?.checked){
			console.log("true", inputCheckbox?.name)
		} else {
			console.log("false", inputCheckbox?.name)
		}

		inputs.forEach(input => {
			console.log("values", input.value)
		})
	}

	return (
		<div className="main-content admin-page">
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
										<th key={index}>{key.toUpperCase()}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data[1].map((item, index) => (
									<tr key={index}>
										{Object.entries(item).map(([key, value], index) => (
											<td key={index}>{value}</td>
										))}
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
								<div className="input-row">
									<label htmlFor="fname">Firstname</label>
									<input type="text" name="fname" id="fname" />
								</div>
								<div className="input-row">
									<label htmlFor="lname">Lastname</label>
									<input type="text" name="lname" id="lname" />
								</div>
								<div className="input-row">
									<label htmlFor="email">E-Mail</label>
									<input type="email" name="email" id="email" />
								</div>
								<div className="input-row">
									<label htmlFor="password">Password</label>
									<input type="password" name="password" id="password" />
								</div>
								<div className="input-admin-row">
									<label htmlFor="isadmin">isAdmin?</label>
									<input type="checkbox" name="isadmin" id="isadmin" />
								</div>
							</>
						)}
						{activeTab === "tickets" && (
							<>
								<h2>Add Ticket</h2>
								<div className="input-row">
									<label htmlFor="title">Title</label>
									<input type="text" name="title" id="title" />
								</div>
								<div className="input-row">
									<label htmlFor="creator">Creator</label>
									<input type="text" name="creator" id="creator" defaultValue={currentUser} />
								</div>
								<div className="input-row">
									<label htmlFor="email">Editor</label>
									<input type="email" name="email" id="email" />
								</div>
								<div className="input-row">
									<label htmlFor="password">Password</label>
									<input type="password" name="password" id="password" />
								</div>
							</>
						)}
						<div className="input-btn-row">
							<button className="btn">Add {activeTab.charAt(0).toUpperCase()+activeTab.slice(1, -1)}</button>
							<button className="btn" onClick={(() => {setOpenModal(false)})}>Cancel</button>
						</div>
					</form>
				</div>
			}
		</div>
	)
}

export default AdminPage