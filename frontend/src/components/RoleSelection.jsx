import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RoleSelection() {
  const { authLoading, userData, setSelectedRole } = useContext(AuthContext);
  console.log(authLoading, userData);
  const navigate = useNavigate();
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (role === "admin") {
      navigate("/adminDashboard/addusers");
    } else if (role === "teacher") {
      navigate("/teacherDashboard/addCourseResult");
    } else if (role === "exam committee") {
      navigate("/examCommitteeDashboard/addSessionalResult");
    } else {
      toast.error("Invalid role selected");
    }
  };
  return (
    <div className="container">
      {authLoading ? (
        <div className="text-center mt-5">Loading...</div>
      ) : (
        <div className="mt-5">
          <h1 className="text-center">Welcome {userData?.full_name}</h1>

          <div className="d-flex justify-content-center">
            <div className="border px-5 py-3 w-auto">
              <h3 className="text-center">Please select a role to continue</h3>
              <div className="d-flex justify-content-center">
                {userData?.role &&
                  JSON.parse(userData?.role).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSelectRole(role)}
                      className="btn btn-secondary mx-2"
                    >
                      <span className="text-capitalize">{role}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
