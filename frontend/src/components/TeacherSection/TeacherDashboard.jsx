import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function TeacherDashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 border p-0 ">
          <h5 className="text-center text-decoration-underline">
            Teacher Dashboard
          </h5>
          <Sidebar />
        </div>
        <div className="col-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
