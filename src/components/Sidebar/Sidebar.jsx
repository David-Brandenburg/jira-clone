import React, { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";
import "./Sidebar.scss";

export const Sidebar = () => {
	const {theme} = useContext(ThemeContext)

	return (
		<aside className={theme === "light" ? "light" : "dark"}>
			<div className="aside-head-row">
				<i className="bi bi-rocket-takeoff"></i>
				<div className="Überschrift-text">
					<h1>Clone Way</h1>
					<p>Software Project</p>
				</div>
			</div>
			<hr />
			<div className="aside-row">
				<h2>PLANNING</h2>
				<div className="icon-text">
					<i className="bi bi-list-nested"></i>
					<p>Roadmap</p>
				</div>
				<div className="icon-text">
					<i className="bi bi-list-columns-reverse"></i>
					<p>Backlog</p>
				</div>
				<div className="icon-text">
					<i className="bi bi-border-all"></i>
					<p>Board</p>
				</div>
				<div className="icon-text">
					<i className="bi bi-graph-up-arrow"></i>
					<p>Reports</p>
				</div>
				<div className="icon-text">
					<i className="bi bi-view-list"></i>
					<p>Issues</p>
				</div>
			</div>
			<hr />
			<div className="aside-row">
				<h2>DEVELOPMENT</h2>
				<div className="icon-text">
					<i className="bi bi-code-slash"></i>
					<p>Code</p>
				</div>
				<div className="icon-text">
					<i className="bi bi-view-stacked"></i>
					<p>Releases</p>
				</div>
			</div>
			<hr />
			<div className="aside-row">
				<h2>OPERATIONS</h2>
				<div className="icon-text">
					<i className="bi bi-cloud-arrow-up"></i>
					<p>Depolyments</p>
				</div>
				<div className="icon-text">
					<i className="bi bi-telephone-x"></i>
					<p>Releases</p>
				</div>
			</div>
		</aside>
	);
};
