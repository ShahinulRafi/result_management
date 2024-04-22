import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function AddCoursePage() {
  // course_id,    course_name,    credit_hour,    classTest_total_marks,    attendance_total_marks,    final_total_marks,    session,
  const [courseID, setCourseID] = useState("");
  const [courseName, setCourseName] = useState("");
  const [creditHour, setCreditHour] = useState(0);
  const [classTestTotalMarks, setClassTestTotalMarks] = useState(0);
  const [attendanceTotalMarks, setAttendanceTotalMarks] = useState(0);
  const [finalTotalMarks, setFinalTotalMarks] = useState(0);
  const [session, setSession] = useState("1st Year");

  const handleAddCourse = () => {
    if (
      !courseID ||
      !courseName ||
      !session ||
      creditHour === 0 ||
      classTestTotalMarks === 0 ||
      attendanceTotalMarks === 0 ||
      finalTotalMarks === 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    //course_id,    course_name,    credit_hour,    classTest_total_marks,    attendance_total_marks,    final_total_marks,    session,
    fetch("http://localhost:5000/admin/insertCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: courseID,
        course_name: courseName,
        credit_hour: creditHour,
        classTest_total_marks: classTestTotalMarks,
        attendance_total_marks: attendanceTotalMarks,
        final_total_marks: finalTotalMarks,
        session,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setCourseID("");
          setCourseName("");
          setCreditHour(0);
          setClassTestTotalMarks(0);
          setAttendanceTotalMarks(0);
          setFinalTotalMarks(0);
          setSession("1st Year");
          getAllCoursesBySession();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [courses, setCourses] = useState([]);
  const getAllCoursesBySession = () => {
    fetch("http://localhost:5000/admin/allCoursesBySession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: session,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setCourses(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllCoursesBySession();
  }, [session]);

  const handleDeleteCourse = (user) => {
    toast(
      <div>
        <p>Are you sure you want to delete this Course?</p>
        <button
          className="btn btn-danger p-0 px-3 me-2"
          onClick={() => deleteStudent(user)}
        >
          Yes
        </button>
        <button
          className="btn btn-secondary px-3 p-0"
          onClick={() => toast.dismiss()}
        >
          No
        </button>
      </div>
    );
  };

  const deleteStudent = (course) => {
    fetch("http://localhost:5000/admin/deleteCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: course?.course_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getAllCoursesBySession();
          toast.dismiss();
          toast.dismiss();
          toast.dismiss();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [isEditable, setIsEditable] = useState(false);
  const handleEditCourse = (crs) => {
    setCourseID(crs?.course_id);
    setCourseName(crs?.course_name);
    setClassTestTotalMarks(crs?.classTest_total_marks);
    setAttendanceTotalMarks(crs?.attendance_total_marks);
    setFinalTotalMarks(crs?.final_total_marks);
    setCreditHour(crs?.credit_hour);
    setSession(crs?.session);
    setIsEditable(true);
  };

  const cancelEditUser = () => {
    setCourseID("");
    setCourseName("");
    setSession("");
    setAttendanceTotalMarks(0);
    setClassTestTotalMarks(0);
    setFinalTotalMarks(0);
    setCreditHour(0);
    setIsEditable(false);
  };

  const handleUpdateCourse = () => {
    if (
      !courseID ||
      !courseName ||
      !session ||
      creditHour === 0 ||
      classTestTotalMarks === 0 ||
      attendanceTotalMarks === 0 ||
      finalTotalMarks === 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    fetch("http://localhost:5000/admin/updateCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: courseID,
        course_name: courseName,
        credit_hour: creditHour,
        classTest_total_marks: classTestTotalMarks,
        attendance_total_marks: attendanceTotalMarks,
        final_total_marks: finalTotalMarks,
        session,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setCourseID("");
          setCourseName("");
          setCreditHour(0);
          setClassTestTotalMarks(0);
          setAttendanceTotalMarks(0);
          setFinalTotalMarks(0);
          setSession("1st Year");
          setIsEditable(false);
          getAllCoursesBySession();
        } else {
          toast.error(data.message);
        }
      });
  };

  return (
    <>
      <div className="row">
        {/* add user section  */}
        <div className="col-4 pt-3">
          <div className="mb-1">
            <label className="form-label">Course ID</label>
            <input
              className="form-control"
              type="text"
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Course Name</label>
            <input
              className="form-control"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Credit Hour</label>
            <input
              className="form-control"
              type="text"
              value={creditHour}
              onChange={(e) => setCreditHour(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Class Test Total Marks</label>
            <input
              className="form-control"
              type="text"
              value={classTestTotalMarks}
              onChange={(e) => setClassTestTotalMarks(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Attendance Total Marks</label>
            <input
              className="form-control"
              type="text"
              value={attendanceTotalMarks}
              onChange={(e) => setAttendanceTotalMarks(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Final Exam Total Marks</label>
            <input
              className="form-control"
              type="text"
              value={finalTotalMarks}
              onChange={(e) => setFinalTotalMarks(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Session</label>
            <select
              className="form-select py-1"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              <option value="">Select Session</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {isEditable ? (
            <>
              <button
                className="btn btn-primary me-2"
                onClick={handleUpdateCourse}
              >
                Update User
              </button>
              <button className="btn btn-secondary" onClick={cancelEditUser}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAddCourse}>
              Add Student
            </button>
          )}
        </div>
        {/* userlist section */}
        <div className="col-8 border-start pt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6>
              <strong>Course List</strong>
            </h6>
          </div>
          <hr className="m-0 p-0" />
          <div className="table-responsive mt-3">
            <p className="float-end">
              <select
                className="form-select py-1 w-auto"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                <option value="">Select Session</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </p>
            <table className="table table-bordered text-nowrap">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Credit Hour</th>
                  <th>Class Test</th>
                  <th>Attendance</th>
                  <th>Final Exam</th>
                  <th>Session</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((user) => (
                  <tr key={user?.id}>
                    <td>{user?.course_id}</td>
                    <td>{user?.course_name}</td>
                    <td>{user?.credit_hour}</td>
                    <td>{user?.classTest_total_marks}</td>
                    <td>{user?.attendance_total_marks}</td>
                    <td>{user?.final_total_marks}</td>
                    <td>{user?.session}</td>
                    <td>
                      <i
                        className="fa fa-edit text-primary pointer mx-1"
                        onClick={() => handleEditCourse(user)}
                      />
                      <i
                        className="fa fa-trash text-danger pointer"
                        onClick={() => handleDeleteCourse(user)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
