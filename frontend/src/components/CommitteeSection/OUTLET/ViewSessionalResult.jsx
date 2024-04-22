import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "../../../context/AuthContext";

export default function ViewSessionalResult() {
  const { userData } = useContext(AuthContext);
  const [selectedSession, setSelectedSession] = useState("");

  const [userCommitteeList, setUserCommitteeList] = useState([]);

  const getUserCommitteeList = () => {
    console.log("first");
    fetch("http://localhost:5000/admin/committeeListByUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userData.userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "committee");
        if (data.ok) {
          setUserCommitteeList(data.message);
        } else {
          toast.error("Failed to fetch committee list");
        }
      });
  };

  useEffect(() => {
    if (userData?.userId) {
      getUserCommitteeList();
    }
  }, [userData?.userId]);

  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
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

  const [resultList, setResultList] = useState([]);

  const fetchAllSessionalResult = () => {
    fetch("http://localhost:5000/server/allSessionalVivaResultsBySession", {
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
        console.log(data, "prev");
        if (data.ok) {
          setResultList(data.message);
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  const fetchIndividualSessionalResult = () => {
    fetch("http://localhost:5000/server/allSessionalVivaResultsByStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: selectedSession,
        student_id: selectedStudent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "prev");
        if (data.ok) {
          setResultList(data.message);
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  useEffect(() => {
    if (selectedSession) {
      getStudentList();
      fetchAllSessionalResult();
    }
  }, [selectedSession]);

  useEffect(() => {
    if (selectedStudent !== "") {
      fetchIndividualSessionalResult();
    } else {
      fetchAllSessionalResult();
    }
  }, [selectedStudent]);

  const handlePrint = (divID) => {
    console.log("Printing...", divID);
    const printSection = document.querySelector(".print-section");
    const targetDiv = document.getElementById(divID);

    if (printSection && targetDiv) {
      printSection.innerHTML = targetDiv.innerHTML;
    }
    window.print();
  };

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
                  }}
                >
                  <option value="">Select Session</option>
                  {userCommitteeList.map((committee) => (
                    <option key={committee.session} value={committee.session}>
                      {committee?.committee_name} - ({committee.session})
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <label>Students</label>
                <select
                  className="form-select-sm d-block"
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                  }}
                >
                  <option value="">All Student</option>
                  {studentList.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.full_name} - ({student.student_id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex justify-content-between  ">
            <p>Student Sessional Result</p>
            <p
              className="border py-1 px-3 pointer"
              onClick={() => handlePrint("PrintDiv")}
            >
              Print
            </p>
          </div>
          {selectedSession ? (
            <div id="PrintDiv">
              {resultList.map((student, index) => (
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <h5 className="card-title">{student.full_name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Student ID: {student.student_id}
                    </h6>
                    <table className="table table-bordered">
                      <thead>
                        <tr className="text-center">
                          <th>Segment Name</th>
                          <th>Obtain Marks</th>
                          <th>Total Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Field Test</td>
                          <td>{student.field_obtain_marks}</td>
                          <td>{student.field_total_marks}</td>
                        </tr>
                        {/* Add similar rows for Slide, Class Note, and Viva */}
                        <tr>
                          <td>Slide</td>
                          <td>{student.slide_obtain_marks}</td>
                          <td>{student.slide_total_marks}</td>
                        </tr>
                        <tr>
                          <td>Class Note</td>
                          <td>{student.note_obtain_marks}</td>
                          <td>{student.note_total_marks}</td>
                        </tr>
                        <tr>
                          <td>Viva</td>
                          <td>{student.viva_obtain_marks}</td>
                          <td>{student.viva_total_marks}</td>
                        </tr>

                        <tr>
                          <td>Class Test (avg)</td>
                          <td colSpan={2}>{student.avg_classTest}</td>
                        </tr>
                        <tr>
                          <td>Attendance (avg)</td>
                          <td colSpan={2}>{student.avg_attendance}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">Select Session</p>
          )}
        </div>
      </div>
    </>
  );
}
