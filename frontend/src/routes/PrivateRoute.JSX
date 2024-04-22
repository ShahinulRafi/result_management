/* eslint-disable react/prop-types */
// Private Routes JSX

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export default function PrivateRoute({ children }) {
  const { authLoading, userData } = useContext(AuthContext);
  if (!authLoading) {
    return userData?.role &&
      JSON.parse(userData?.role).includes(
        "admin" || "teacher" || "exam committee"
      )
      ? children
      : toast.error("You are not authorized to view this page");
  }
  return children;
}
