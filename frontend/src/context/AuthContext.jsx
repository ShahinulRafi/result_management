/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({});
  const [selectedRole, setSelectedRole] = useState("");

  const navigator = useNavigate();

  const getUserInformation = () => {
    setAuthLoading(true);
    console.log(localStorage.getItem("token"));
    fetch("http://localhost:5000/server/userInfoByToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: localStorage.getItem("token") }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          console.log(data);
          setUserData(data.message);
        } else {
          console.log(data);
          alert("User data fetch failed");
        }
      })
      .finally(() => setAuthLoading(false));
  };

  useEffect(() => {
    getUserInformation();
    // if (localStorage.getItem("token")) {
    //   getUserInformation();
    // }
  }, [localStorage.getItem("token"), token]);

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserData({});
    setSelectedRole("");
    navigator("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userData,
        selectedRole,
        setSelectedRole,
        authLoading,
        setAuthLoading,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
