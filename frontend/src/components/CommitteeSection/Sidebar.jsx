import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { logOut } = useContext(AuthContext);

  return (
    <div className="container-fluid p-0" style={{ height: "99vh" }}>
      <NavLink className="sidebarLink" to="addSessionalResult">
        Add Sessional Result
      </NavLink>

      <NavLink className="sidebarLink" to="viewCourseResult">
        View Course Result
      </NavLink>

      <NavLink className="sidebarLink" to="viewSessionalResult">
        View Sessional Result
      </NavLink>

      <Link className="sidebarLink" to="/roleSelection">
        <i className="fas fa-arrow-left" /> Back
      </Link>
      <div className="sidebarLink text-danger pointer" onClick={logOut}>
        <i className="fas fa-arrow-right-from-bracket pointer" /> Log Out
      </div>
    </div>
  );
}
