/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// TeacherRoute

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export default function TeacherRoute({ children }) {
  const { authLoading, userData } = useContext(AuthContext);
  if (!authLoading) {
    return userData?.role &&
      JSON.parse(userData?.role).includes(
         "teacher"
      )
      ? children
      : toast.error("You are not authorized to view this page");
  }
  return children;
}
