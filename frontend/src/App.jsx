import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import RoleSelection from "./components/RoleSelection";
import TeacherDashboard from "./components/TeacherSection/TeacherDashboard";
import AdminDashboard from "./components/AdminSection/AdminDashboard";
import CommitteeDashboard from "./components/CommitteeSection/CommitteeDashboard";
import AddUserPage from "./components/AdminSection/OUTLET/AddUserPage";
import AddStudentPage from "./components/AdminSection/OUTLET/AddStudentPage";
import AddCoursePage from "./components/AdminSection/OUTLET/AddCoursePage";
import AssignCoursePage from "./components/AdminSection/OUTLET/AssignCoursePage";
import AddCommitteePage from "./components/AdminSection/OUTLET/AddCommitteePage";
import AdminRoute from "./routes/AdminRoute.JSX";
import PrivateRoute from "./routes/PrivateRoute.JSX";
import TeacherRoute from "./routes/TeacherRoute";
import CommitteeRoute from "./routes/CommitteeRoute.JSX";
import AddCourseResult from "./components/TeacherSection/OUTLET/AddCourseResult";
import AddSessionalResult from "./components/CommitteeSection/OUTLET/AddSessionalResult";
import ViewSessionalResult from "./components/CommitteeSection/OUTLET/ViewSessionalResult";
import ViewCourseResult from "./components/CommitteeSection/OUTLET/ViewCourseResult";

function App() {
  const { authLoading } = useContext(AuthContext);
  return (
    <>
      <div className="print-section"></div>
      <div className="view-section">
        {authLoading && (
          <div
            className="loading"
            style={{
              zIndex: 1000,
            }}
          >
            <div className="text-center mt-5">Loading...</div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/roleSelection"
            element={
              <PrivateRoute>
                <RoleSelection />
              </PrivateRoute>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          >
            {/* Admin Outlet */}
            <Route path="addusers" element={<AddUserPage />} />
            <Route path="addstudents" element={<AddStudentPage />} />
            <Route path="addcourses" element={<AddCoursePage />} />
            <Route path="assigncourses" element={<AssignCoursePage />} />
            <Route path="addcommittees" element={<AddCommitteePage />} />
          </Route>

          <Route
            path="/teacherDashboard"
            element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            }
          >
            {/* Teacher Outlet */}
            <Route path="addCourseResult" element={<AddCourseResult />} />
          </Route>

          <Route
            path="/examCommitteeDashboard"
            element={
              <CommitteeRoute>
                <CommitteeDashboard />
              </CommitteeRoute>
            }
          >
            {/* Exam Committee Outlet */}
            <Route path="addSessionalResult" element={<AddSessionalResult />} />
            <Route
              path="viewSessionalResult"
              element={<ViewSessionalResult />}
            />
            <Route path="ViewCourseResult" element={<ViewCourseResult />} />
          </Route>

          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
