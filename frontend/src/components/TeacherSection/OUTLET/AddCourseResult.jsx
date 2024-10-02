import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "../../../context/AuthContext";

export default function AddCourseResult() {
  const { userData } = useContext(AuthContext);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [selectedSession, setSelectedSession] = useState("");
  const [courses, setCourses] = useState([]);
  const generateRandomFixedKey = () => {
    // Generate a pseudo-random 6-digit number using the student ID as a seed
    const randomKey = Math.floor(Math.random() * 900000) + 100000; // Always returns a 6-digit number
    return randomKey;
  };
  const getUserCourses = () => {
    fetch("http://localhost:5000/admin/allAssignCoursesByTeacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teacher_id: userData?.userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setCourses(data.message);
        } else {
          toast.error("Failed to fetch courses");
        }
      });
  };

  useEffect(() => {
    if (userData?.userId) {
      getUserCourses();
    }
  }, [userData?.userId]);

  const handleCourseChange = (e) => {
    setSelectedCourse(JSON.parse(e.target.value));
  };

  const [studentList, setStudentList] = useState([]);
  const getStudentList = () => {
    fetch("http://localhost:5000/admin/allStudentsBySession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: selectedSession,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          const students = data.message;
          const updatedStudents = students.map((student) => {
            student.classTest_obtain_marks = 0;
            student.attendance_obtain_marks = 0;
            student.final_obtain_marks = 0;
            return student;
          });
          setStudentList(updatedStudents);
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  useEffect(() => {
    if (selectedSession) {
      getStudentList();
    }
  }, [selectedSession]);

  const handleMarksChange = (value, type, index, maxValue) => {
    console.log(value, type, index, maxValue);
    if (+value > +maxValue) {
      toast.error("Marks can't be greater than total marks");
      return;
    }
    setStudentList((prevStudentList) => {
      const updatedStudentList = [...prevStudentList];
      updatedStudentList[index] = {
        ...updatedStudentList[index],
        [type]: value,
      };
      return updatedStudentList;
    });
  };

  const SubmitResult = () => {
    if (studentList.length === 0) {
      toast.error("No student found");
      return;
    }
    if (
      studentList.some(
        (student) =>
          student.classTest_obtain_marks === 0 ||
          student.attendance_obtain_marks === 0 ||
          student.final_obtain_marks === 0
      )
    ) {
      toast.error("Please fill all the marks");
      return;
    }

    if (selectedCourse.course_id === undefined) {
      toast.error("Please select course");
      return;
    }

    if (selectedSession === "") {
      toast.error("Please select session");
      return;
    }

    fetch("http://localhost:5000/server/insertCourseResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allResults: studentList,
        course_id: selectedCourse.course_id,
        session: selectedSession,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          toast.success("Result submitted successfully");
        } else {
          toast.error("Failed to submit result");
        }
      });
  };

  const fetchPreviousResult = () => {
    fetch("http://localhost:5000/server/allResultsByCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: selectedCourse.course_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "prev");
        if (data.ok) {
          if (data.message.length === 0) {
            const students = studentList.map((student) => {
              student.classTest_obtain_marks = 0;
              student.attendance_obtain_marks = 0;
              student.final_obtain_marks = 0;
              return student;
            });
            setStudentList(students);
            return;
          } else setStudentList(data.message);
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  useEffect(() => {
    if (selectedCourse?.course_id) {
      fetchPreviousResult();
    }
  }, [selectedCourse?.course_id]);

  return (
    <>
      <div className="row">
        <div className="col-12 my-3 ">
          <div className="card p-2">
            <div className="d-flex">
              <div className="me-3">
                <label>Session</label>
                <select
                  className="form-select-sm d-block"
                  value={selectedSession}
                  onChange={(e) => {
                    setSelectedSession(e.target.value);
                    setSelectedCourse("");
                  }}
                >
                  <option value="">Select Session</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div className="">
                <label>Courses</label>
                <select
                  className="form-select-sm d-block"
                  value={JSON.stringify(selectedCourse)}
                  onChange={handleCourseChange}
                >
                  <option value="">Select Your Course</option>
                  {courses
                    .filter((course) => course.session === selectedSession)
                    .map((course) => (
                      <option key={course._id} value={JSON.stringify(course)}>
                        {course.course_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <p>Student list</p>
          {selectedCourse?.course_name && selectedSession ? (
            <>
              <table className="table table-bordered table-hover text-nowrap">
                <thead>
                  <tr className="text-center">
                    <th>Student ID</th>
                    <th>Name</th>
                    {/* <th>Token</th> */}
                    <th>Class Test</th>
                    <th>Attendance</th>
                    {/* <th>Final</th> */}
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student, index) => (
                    <tr key={index}>
                      <td>{student.student_id}</td>
                      <td>{student.full_name}</td>
                      {/* <td>{generateRandomFixedKey()}</td> */}
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={selectedCourse?.classTest_total_marks}
                            value={student.classTest_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "classTest_obtain_marks",
                                index,
                                selectedCourse?.classTest_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            readOnly
                            disabled
                            value={selectedCourse?.classTest_total_marks}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={selectedCourse?.attendance_total_marks}
                            value={student.attendance_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "attendance_obtain_marks",
                                index,
                                selectedCourse?.attendance_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            readOnly
                            disabled
                            value={selectedCourse?.attendance_total_marks}
                          />
                        </div>
                      </td>
                      {/* <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={selectedCourse?.final_total_marks}
                            value={student.final_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "final_obtain_marks",
                                index,
                                selectedCourse?.final_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            readOnly
                            disabled
                            value={selectedCourse?.final_total_marks}
                          />
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={SubmitResult}>
                  Submit Result
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">Select Course and Session</p>
          )}
        </div>

        <div className="col-12">
          <p>Student list</p>
          {selectedCourse?.course_name && selectedSession ? (
            <>
              <table className="table table-bordered table-hover text-nowrap">
                <thead>
                  <tr className="text-center">
                    {/* <th>Student ID</th> */}
                    {/* <th>Name</th> */}
                    <th>Token</th>
                    {/* <th>Class Test</th>
                    <th>Attendance</th> */}
                    <th>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student, index) => (
                    <tr key={index}>
                      {/* <td>{student.student_id}</td> */}
                      {/* <td>{student.full_name}</td> */}
                      <td>{generateRandomFixedKey()}</td>
                      {/* <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={selectedCourse?.classTest_total_marks}
                            value={student.classTest_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "classTest_obtain_marks",
                                index,
                                selectedCourse?.classTest_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            readOnly
                            disabled
                            value={selectedCourse?.classTest_total_marks}
                          />
                        </div>
                      </td> */}
                      {/* <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={selectedCourse?.attendance_total_marks}
                            value={student.attendance_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "attendance_obtain_marks",
                                index,
                                selectedCourse?.attendance_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            readOnly
                            disabled
                            value={selectedCourse?.attendance_total_marks}
                          />
                        </div>
                      </td> */}
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={selectedCourse?.final_total_marks}
                            value={student.final_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "final_obtain_marks",
                                index,
                                selectedCourse?.final_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            readOnly
                            disabled
                            value={selectedCourse?.final_total_marks}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={SubmitResult}>
                  Submit Result
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">Select Course and Session</p>
          )}
        </div>
      </div>
    </>
  );
}
