import React from "react";
import "./Sidebar.scss";

export const Sidebar = () => {
  return (
    <div className="main">
      <div className="section-1">
        <i className="bi bi-rocket-takeoff"></i>
        <div className="Überschrift-text">
          <h1>Clone Way</h1>
          <p>Software Project</p>
        </div>
      </div>

      <div className="section-2">
        <h2>PLANNING</h2>
        <div className="icon-text">
          <i className="bi bi-list-nested"></i>
          <p> Roadmap</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-list-columns-reverse"></i>
          <p>Backlog</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-border-all"></i>
          <p> Board</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-graph-up-arrow"></i>
          <p> Reports</p>
        </div>
        <div className="icon-text">
          <i className="bi bi-view-list"></i>
          <p> Issues</p>
        </div>
      </div>

      <div className="section-3">
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

      <div className="section-4">
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

      <hr />
    </div>
  );
};
