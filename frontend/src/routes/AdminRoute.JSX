/* eslint-disable react/prop-types */
// Private Routes JSX

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export default function AdminRoute({ children }) {
  const { authLoading, userData } = useContext(AuthContext);
  if (!authLoading) {
    return userData?.role && JSON.parse(userData?.role).includes("admin")
      ? children
      : toast.error("You are not authorized to view this page");
  }
  return children;
}
