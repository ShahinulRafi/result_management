import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "../../../context/AuthContext";

export default function AddSessionalResult() {
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
            student.field_obtain_marks = 0;
            student.field_total_marks = 0;

            student.slide_obtain_marks = 0;
            student.slide_total_marks = 0;

            student.note_obtain_marks = 0;
            student.note_total_marks = 0;

            student.viva_obtain_marks = 0;
            student.viva_total_marks = 0;
            return student;
          });
          console.log(updatedStudents);
          setStudentList(updatedStudents);
        } else {
          toast.error("Failed to fetch student list");
        }
      })
      .then(() => {
        fetchPreviousResult();
      });
  };

  useEffect(() => {
    if (selectedSession) {
      getStudentList();
    }
  }, [selectedSession]);

  const handleMarksChange = (value, type, index, maxValue) => {
    if (+value < 0) {
      toast.error("Marks can't be negative");
      return;
    }
    if (
      type === "field_total_marks" ||
      type === "slide_total_marks" ||
      type === "note_total_marks" ||
      type === "viva_total_marks"
    ) {
      setStudentList((prevStudentList) => {
        const updatedStudentList = prevStudentList.map((student) => ({
          ...student,
          [type]: value,
        }));
        return updatedStudentList;
      });
    } else {
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
    }
  };

  const SubmitResult = () => {
    if (studentList.length === 0) {
      toast.error("No student found");
      return;
    }
    if (
      studentList.some(
        (student) =>
          student.field_obtain_marks === 0 ||
          student.slide_obtain_marks === 0 ||
          student.note_obtain_marks === 0 ||
          student.viva_obtain_marks === 0 ||
          student.field_total_marks === 0 ||
          student.slide_total_marks === 0 ||
          student.note_total_marks === 0 ||
          student.viva_total_marks === 0
      )
    ) {
      toast.error("Please fill all the marks");
      return;
    }

    if (selectedSession === "") {
      toast.error("Please select session");
      return;
    }

    fetch("http://localhost:5000/server/insertSessionalVivaResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allResults: studentList,
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
    console.log(selectedSession);
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
          if (data.message.length !== 0) {
            // const students = studentList.map((student) => {
            //   student.field_obtain_marks = 0;
            //   student.field_total_marks = 0;

            //   student.slide_obtain_marks = 0;
            //   student.slide_total_marks = 0;

            //   student.note_obtain_marks = 0;
            //   student.note_total_marks = 0;

            //   student.viva_obtain_marks = 0;
            //   student.viva_total_marks = 0;

            //   return student;
            // });
            // setStudentList(students);
            // console.log(studentList, "ss");
            setStudentList(data.message);
            return;
          } else {
            // setStudentList(data.message);
          }
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-12 my-3 ">
          <div className="card p-2">
            <div className="d-flex">
              <div className="me-3">
                <label>Committee</label>
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
            </div>
          </div>
        </div>

        <div className="col-12">
          <p>Student list</p>
          {selectedSession ? (
            <>
              <table className="table table-bordered table-hover text-nowrap">
                <thead>
                  <tr className="text-center">
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Field Test</th>
                    <th>Slide</th>
                    <th>Class Note</th>
                    <th>Viva</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student, index) => (
                    <tr key={index}>
                      <td>{student.student_id}</td>
                      <td>{student.full_name}</td>
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            value={student.field_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "field_obtain_marks",
                                index,
                                student.field_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            value={student.field_total_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "field_total_marks",
                                index,
                                student.field_total_marks
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            value={student.slide_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "slide_obtain_marks",
                                index,
                                student.slide_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            value={student.slide_total_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "slide_total_marks",
                                index,
                                student.slide_total_marks
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            value={student.note_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "note_obtain_marks",
                                index,
                                student.note_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            value={student.note_total_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "note_total_marks",
                                index,
                                student.note_total_marks
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          <input
                            className="form-control"
                            type="number"
                            min={0}
                            value={student.viva_obtain_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "viva_obtain_marks",
                                index,
                                student.viva_total_marks
                              )
                            }
                          />
                          <span className="mx-2">/</span>
                          <input
                            className="form-control"
                            value={student.viva_total_marks}
                            onChange={(e) =>
                              handleMarksChange(
                                e.target.value,
                                "viva_total_marks",
                                index,
                                student.viva_total_marks
                              )
                            }
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
            <p className="text-center">Select Session</p>
          )}
        </div>
      </div>
    </>
  );
}
