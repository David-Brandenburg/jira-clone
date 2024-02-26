import { useState, useEffect, useContext } from "react"
import { LoggedinContext } from "../../context/loggedinContext"
import { ThemeContext } from "../../context/themeContext";
import { ToastContainer, toast } from "react-toastify";
import { generateRandomAvatar } from "../..";
import "./profilepage.scss"

const ProfilePage = () => {
	const defaultError = String.fromCharCode(160)
	const [userData, setUserData] = useState({});
	const [editProfile, setEditProfile] = useState(false);
	const [emailHasChanged, setEmailHasChanged] = useState(false);
	const [currentAvatar, setCurrentAvatar] = useState(null);
	const [newAvatar, setNewAvatar] = useState(null);
	const [tickets, setTickets] = useState([]);
	const [fname, setFName] = useState("");
	const [lname, setLName] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState(null);
	const [currentInputPassword, setCurrentInputPassword] = useState(null)
	const [newPassword, setNewPassword] = useState(null);
	const [errormsg, setErrorMsg] = useState(defaultError)
	
	const { loggedInUser, setLoggedInUser } = useContext(LoggedinContext);
	const { theme } = useContext(ThemeContext);
	const userId = loggedInUser.userId;

	const url = "http://localhost:5000/users/";
	const options = {
		method: "GET",
	};

	const handleEditProfile = () => {
		setEditProfile(prev => !prev)
	};

	const changeAvatar = () => {
		setNewAvatar(generateRandomAvatar())
	};

	const restoreAvatar = () => {
		setNewAvatar(currentAvatar)
	}

	const handleCurrentPasswordInput = (e) => {
		setCurrentInputPassword(e.target.value);
	};

	function clearPasswordInputs() {
		const passwordInputs = document.querySelectorAll("input[type='password']");
		passwordInputs.forEach(input => {
			input.value = null;
			input.style.outline = "none";
		});
		setCurrentInputPassword(null);
		setNewPassword(null)
	}

	const handlePatchUser = async () => {
		const optionsPatch = {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				fname: fname,
				lname: lname,
				avatar: newAvatar || currentAvatar,
				password: newPassword || currentPassword,
			}),
		}
		try {
			const response = await fetch(url, options);
			if (!response.ok){
				throw new Error("Failed to fetch!", response.status)
			}
			const users = await response.json();
			const checkMail = users.find(user => user.email === email);
			if (checkMail && emailHasChanged) {
				toast.warn("E-Mail already in use!", {autoClose: 3000});
				throw new Error("E-Mail already in use!");
			} else {
				if (newPassword === currentPassword) {
					toast.warn("You can't use an old password", {autoClose: 3000})
				} else if (!newPassword && !currentInputPassword){
					const resp = await fetch(`${url}${userId}`, optionsPatch);
					if (!resp.ok){
						throw new Error("Failed to fetch!", resp.status);
					}
					fetchUser();
					setEditProfile(false);
					setTimeout(() => {
						setLoggedInUser({avatar: newAvatar || currentAvatar, userId: userId});
					}, 3000);
					toast.success("Successfully updated changes!", {autoClose: 3000});
				} else if (newPassword && currentInputPassword){
					if (currentInputPassword !== currentPassword){
						toast.error("Wrong old password!", {autoClose: 3000})
					} else {
						const resp = await fetch(`${url}${userId}`, optionsPatch);
						if (!resp.ok){
							throw new Error("Failed to fetch!", resp.status);
						}
						fetchUser();
						setEditProfile(false);
						setTimeout(() => {
							setLoggedInUser({avatar: newAvatar || currentAvatar, userId: userId});
						}, 3000);
						clearPasswordInputs();
						toast.success("Successfully updated changes!", {autoClose: 3000});
					}
				} else {
					toast.warn("You have to enter both password fields!", {autoClose: 3000})
				}
			}
		} catch (error) {
			console.error(error);
		};
	};

	const fetchUser = async () => {
		try {
			const resp = await fetch(`${url}${userId}`, options);
			if (!resp.ok){
				throw new Error("Failed to fetch!", resp.status);
			};
			const user = await resp.json();
			setUserData(user);
			setTickets(user.ticketIds);
			setCurrentAvatar(user.avatar);
			setNewAvatar(user.avatar);
			setEmail(user.email);
			setFName(user.fname);
			setLName(user.lname);
			setCurrentPassword(user.password);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);
	
	useEffect(() => {
		const btns = document.querySelectorAll(".btn");
		const inputs = document.querySelectorAll("input:not([type='checkbox']):not(#search)");
		const checkBox = document.getElementById("editprofile");
		if (editProfile){
			checkBox.checked = true;
			btns.forEach(btn => {
				btn.disabled = false;
			})
			inputs.forEach(input => {
				input.disabled = false;
			})
		} else {
			checkBox.checked = false;
			btns.forEach(btn => {
				btn.disabled = true;
			})
			inputs.forEach(input => {
				input.disabled = true;
			})
		}
	}, [editProfile]);

	useEffect(() => {
		// kann man leer lassen, oder etwas ausführen sobald sich userData verändert - hier leer damit es immer aktuell ist.
		// also, wenn ich userData setze oben wäre das 1. abgreifen von userData leer, also revaluiere ich userData, wenn sie sich verändert
		// mit der abhängigkeitsarray
		// console.log("userData: ", userData)
	}, [userData]);

	useEffect(() => {
		const passwordInputs = document.querySelectorAll("input[type='password']");
		const nope = "1px solid red";
		const yes = "1px solid green";
		if (currentInputPassword) {
			if (currentInputPassword !== currentPassword) {
				passwordInputs[0].style.outline = nope;
				setErrorMsg("Wrong password!");
			} else {
				passwordInputs[0].style.outline = yes;
				setErrorMsg(defaultError);
			}
		} else {
			passwordInputs[0].style.outline = "none";
			setErrorMsg(defaultError);
		}
		if (newPassword && !currentInputPassword) {
			setErrorMsg("You have to enter your old password!");
		} else if (newPassword){
			if (newPassword === currentInputPassword) {
				passwordInputs.forEach(input => {
					input.style.outline = nope;
					setErrorMsg("You can't use an old password!");
				});
			} else if (newPassword !== currentInputPassword && newPassword.length >= 6){
				passwordInputs[1].style.outline = yes;
			};
		} else {
			passwordInputs[1].style.outline = "none";
		};
	}, [currentInputPassword, newPassword, currentPassword, defaultError]);

	return (
		<div className={`main-content profile-content`}>
			<ToastContainer />
			<div className="profile-wrapper">
				<div className={`profile-header ${theme}`}>
					<div className="dummyBox"></div>
					<h2>{`${fname}'s Profile`}</h2>
					<div className="check">
						<input type="checkbox" name="editprofile" id="editprofile" onChange={handleEditProfile} />
						<label htmlFor="editprofile"></label>
					</div>
				</div>
				<div className={`profile-content-wrapper ${theme}`}>
					<div className="profile-content-left">
						<div className="user-info-row">
							<h3>UserID: <span style={{color: "#3b8dff", fontWeight: "normal"}}>{userData.id}</span></h3>
						</div>
						<hr style={{width: "75%"}}/>
						<div className="user-info-row">
							<h3>Firstname</h3>
							<input type="text" name="fname" id="fname" defaultValue={userData.fname} onChange={((e) => setFName(e.target.value))}/>
						</div>
						<hr />
						<div className="user-info-row">
							<h3>Lastname</h3>
							<input type="text" name="lname" id="lname" defaultValue={userData.lname} onChange={((e) => setLName(e.target.value))}/>
						</div>
						<hr />
						<div className="user-info-row">
							<h3>E-Mail</h3>
							<input type="email" name="email" id="email" defaultValue={userData.email} onChange={((e) => {setEmail(e.target.value); setEmailHasChanged(true)})}/>
						</div>
						<hr />
						<div className="user-info-row">
							<h3>Your Ticket Id's</h3>
							<p>
								{tickets.length === 0
									? "N/A"
									: tickets.length < 2
									? (<span>{tickets}</span>)
									: (<span>{tickets.join(", ")}</span>)
								}
							</p>
						</div>
						<hr />
						<div className="user-info-row user-pw-row">
							<h3>Change Password</h3>
							<label htmlFor="oldPassword">
								<p>Enter current password</p>
								<input type="password" name="oldPassword" id="oldPassword" onChange={handleCurrentPasswordInput} defaultValue={currentInputPassword}/>
							</label>
							<label htmlFor="newPassword">
								<p>Enter new password</p>
								<input type="password" name="newPassword" id="newPassword" onChange={((e) => {setNewPassword(e.target.value)})}/>
							</label>
							<small style={{color: "red"}}>{errormsg}</small>
						</div>
					</div>
					<div className="profile-content-right">
						<div className="avatar-content">
							<h3>Avatar</h3>
							<hr />
							<div className="avatar-row">
								<div className="avatar-box">
									<div className="avatar-wrapper">
										<img src={currentAvatar} alt="" />
									</div>
									<h4>Current Avatar</h4>
								</div>
								<div className="avatar-box">
									<div className="avatar-wrapper">
										<img src={newAvatar} alt="" />
									</div>
									<h4>Preview new Avatar</h4>
								</div>
							</div>
							<div className="btn-row">
								<button className="btn restore-av-btn" onClick={restoreAvatar}>Restore Avatar</button>
								<button className="btn change-av-btn" onClick={changeAvatar}>Change Avatar</button>
							</div>
						</div>
						<div className="btn-wrapper">
							<button className="btn" id="saveBtn" onClick={handlePatchUser}>Save Changes</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage