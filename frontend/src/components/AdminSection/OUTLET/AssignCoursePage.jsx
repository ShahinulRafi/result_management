import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function AssignCoursePage() {
  // course_id, teacher_id
  const [courseID, setCourseID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [session, setSession] = useState("1st Year");

  const handleAddAssignCourse = () => {
    if (!courseID || !teacherID) {
      toast.error("Please fill all the fields");
      return;
    }
    // course_id, teacher_id

    fetch("http://localhost:5000/admin/insertAssignCourseTeacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: courseID,
        teacher_id: teacherID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setCourseID("");
          setTeacherID("");
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

  const handleDeleteAssignCourse = (user) => {
    toast(
      <div>
        <p>Are you sure you want to delete this Course Teacher?</p>
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

  const deleteStudent = (courseTeacher) => {
    fetch("http://localhost:5000/admin/deleteAssignCourseTeacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: courseTeacher?.course_id,
        teacher_id: courseTeacher?.teacher_id,
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

  const [coursesTeacher, setCoursesTeacher] = useState([]);
  const getAllCoursesTeacher = () => {
    fetch("http://localhost:5000/admin/allAssignCoursesByTeacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacher_id: teacherID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setCoursesTeacher(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllCoursesTeacher();
  }, [teacherID]);

  const [teachers, setTeachers] = useState([]);
  const getAllTeachers = () => {
    fetch("http://localhost:5000/admin/allUsersBySingleRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        singleRole: "teacher",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setTeachers(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllTeachers();
  }, []);

  return (
    <>
      <div className="row">
        {/* add user section  */}
        <div className="col-4 pt-3">
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

          <div className="mb-1">
            <label className="form-label">Course</label>
            <select
              className="form-select py-1"
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option value={course.course_id}>{course.course_name}</option>
              ))}
            </select>
          </div>
          <div className="mb-1">
            <label className="form-label">Teacher</label>
            <select
              className="form-select py-1"
              value={teacherID}
              onChange={(e) => setTeacherID(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option value={teacher.userId}>{teacher.full_name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleAddAssignCourse}>
            Assign
          </button>
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
                className="form-select py-1"
                value={teacherID}
                onChange={(e) => setTeacherID(e.target.value)}
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option value={teacher.userId}>{teacher.full_name}</option>
                ))}
              </select>
            </p>
            <table className="table table-bordered text-nowrap">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Teacher</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coursesTeacher.map((crsTc) => (
                  <tr key={crsTc?.id}>
                    <td>{crsTc?.course_id}</td>
                    <td>{crsTc?.course_name}</td>
                    <td>{crsTc?.full_name}</td>
                    <td>
                      <i
                        className="fa fa-trash text-danger pointer"
                        onClick={() => handleDeleteAssignCourse(crsTc)}
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
