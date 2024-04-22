import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 border p-0 ">
          <h5 className="text-center text-decoration-underline">
            Admin Dashboard
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
