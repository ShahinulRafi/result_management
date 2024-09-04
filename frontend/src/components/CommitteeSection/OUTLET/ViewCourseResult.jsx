import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "../../../context/AuthContext";

export default function ViewCourseResult() {
  const { userData } = useContext(AuthContext);
  const [selectedSession, setSelectedSession] = useState("");

  const letterGrade = [
    { marks: 80, grade: "A+", point: 4.0 },
    { marks: 75, grade: "A", point: 3.75 },
    { marks: 70, grade: "A-", point: 3.5 },
    { marks: 65, grade: "B+", point: 3.25 },
    { marks: 60, grade: "B", point: 3.0 },
    { marks: 55, grade: "B-", point: 2.75 },
    { marks: 50, grade: "C+", point: 2.5 },
    { marks: 45, grade: "C", point: 2.25 },
    { marks: 40, grade: "D", point: 2.0 },
    { marks: 0, grade: "F", point: 0.0 },
  ];

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

  const fetchAllCourseResult = () => {
    fetch("http://localhost:5000/server/allResultsBySession", {
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
          const groupData = data.message.reduce((acc, curr) => {
            const { student_id, ...rest } = curr;
            if (!acc[student_id]) {
              acc[student_id] = [];
            }
            acc[student_id].push(rest);
            return acc;
          }, {});
          console.log(groupData, "groupData");
          setResultList(groupData);
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  const fetchIndividualCourseResult = () => {
    fetch("http://localhost:5000/server/allResultsByStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: selectedStudent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "prev");
        if (data.ok) {
          const groupData = data.message.reduce((acc, curr) => {
            const { student_id, ...rest } = curr;
            if (!acc[student_id]) {
              acc[student_id] = [];
            }
            acc[student_id].push(rest);
            return acc;
          }, {});
          console.log(groupData, "groupData");
          setResultList(groupData);
        } else {
          toast.error("Failed to fetch student list");
        }
      });
  };

  useEffect(() => {
    if (selectedSession) {
      getStudentList();
      fetchAllCourseResult();
    }
  }, [selectedSession]);

  useEffect(() => {
    if (selectedStudent !== "") {
      fetchIndividualCourseResult();
    } else {
      fetchAllCourseResult();
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
                    setSelectedStudent("");
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
            <p>Student Course Result</p>
            <p
              className="border py-1 px-3 pointer"
              onClick={() => handlePrint("PrintDiv")}
            >
              Print
            </p>
          </div>
          {selectedSession ? (
            <div id="PrintDiv">
              {Object.values(resultList).map((studentGroup, index) => (
                <div className="card mb-3" key={index}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="text-xs">
                        <div>GRADING SYSTEM</div>
                        <div className="d-flex justify-content-between">
                          <div className="">Numerical Grade</div>
                          <div className="">Letter Grade</div>
                          <div className="">Grade Point</div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <div className="">80% and above </div>
                          <div className="">A+</div>
                          <div className="">4.00</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">75% to less than 80%</div>
                          <div className="">A</div>
                          <div className="">3.75</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">70% to less than 75%</div>
                          <div className="">A-</div>
                          <div className="">3.50</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">65% to less than 70%</div>
                          <div className="">B+</div>
                          <div className="">3.25</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">60% to less than 65%</div>
                          <div className="">B</div>
                          <div className="">3.00</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">55% to less than 60%</div>
                          <div className="">B-</div>
                          <div className="">2.75</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">50% to less than 55%</div>
                          <div className="">C+</div>
                          <div className="">2.50</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">45% to less than 50%</div>
                          <div className="">C</div>
                          <div className="">2.25</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">40% to less than 45%</div>
                          <div className="">D</div>
                          <div className="">2.00</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">Less than 40%</div>
                          <div className="">F</div>
                          <div className="">0.00</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">Incomplete/absent</div>
                          <div className="">X</div>
                          <div className="">X</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">One Credit Mark</div>
                          <div className=""></div>
                          <div className="">25</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">Total Credit Offered</div>
                          <div className=""></div>
                          <div className="">24</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKptyLdCttvlAPQM8Z3WsKx45iutposa6HRQ&s"
                          alt=""
                          width={50}
                          height={50}
                          className="mb-3"
                          style={{ objectFit: "contain" }}
                        />
                        <div className="fw-bold">University of Banagladesh</div>
                        <div className="fw-bold">Chittagong Bangladesh</div>
                        <div className="fw-bold">Grade Sheet</div>
                        <div className="fw-bold">M.S. Examination - 2021</div>
                        <div className="fw-bold">(Thesis Groudiv)</div>
                        <div className="fw-bold">
                          Held in Octobor - December 2022
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between">
                          <div className="">Course No.</div>
                          <div className=""> Title of Courses </div>
                          <div className=""> Marks</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">BOT 101</div>
                          <div className="">Microbiology</div>
                          <div className="">50</div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="">BOT 102</div>
                          <div className="">Microbiology 2</div>
                          <div className="">75</div>
                        </div>
                      </div>
                    </div>
                    <h5 className="card-title text-center mt-5 mb-3 fw-bold">
                      Name: {studentGroup[0].full_name}
                    </h5>
                    <div className="d-flex justify-content-between  ">
                      <h6 className=" mb-2 ">
                        ID No: {Object.keys(resultList)[index]}
                      </h6>

                      <h6 className=" mb-2 ">Session : 2020 -2021</h6>
                      <div></div>
                    </div>
                    <table className="table table-bordered align-middle">
                      <thead>
                        <tr className="text-center">
                          <th>Course</th>
                          <th>No. of Credits</th>
                          <th>Marks (%)</th>
                          <th>Letter Grade</th>
                          <th>Grade Point</th>
                          <th>Point Secured</th>
                          <th>GPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentGroup.map((student, index) => (
                          <React.Fragment key={index}>
                            <tr className="text-center">
                              <td>{student.course_name}</td>
                              <td>{student.credit_hour}</td>
                              <td>
                                {(+student.final_obtain_marks /
                                  +student.final_total_marks) *
                                  100 || 0}
                                {/* ({student.final_obtain_marks}/
                                {student.final_total_marks}) */}
                              </td>
                              <td>
                                {
                                  letterGrade.find(
                                    (grade) =>
                                      grade.marks <=
                                      (+student.final_obtain_marks /
                                        +student.final_total_marks) *
                                        100
                                  ).grade
                                }
                              </td>
                              <td>
                                {letterGrade
                                  .find(
                                    (grade) =>
                                      grade.marks <=
                                      (+student.final_obtain_marks /
                                        +student.final_total_marks) *
                                        100
                                  )
                                  .point.toFixed(2)}
                              </td>
                              <td>
                                {(
                                  letterGrade.find(
                                    (grade) =>
                                      grade.marks <=
                                      (+student.final_obtain_marks /
                                        +student.final_total_marks) *
                                        100
                                  ).point * student.credit_hour
                                ).toFixed(2) || 0}
                              </td>
                              {index === 0 && (
                                <td
                                  className="fw-bold"
                                  rowSpan={studentGroup.length + 1}
                                >
                                  {(
                                    studentGroup
                                      .reduce(
                                        (acc, curr) =>
                                          acc +
                                          +(
                                            letterGrade.find(
                                              (grade) =>
                                                grade.marks <=
                                                (+curr.final_obtain_marks /
                                                  +curr.final_total_marks) *
                                                  100
                                            ).point * curr.credit_hour
                                          ),
                                        0
                                      )
                                      .toFixed(2) /
                                    studentGroup.reduce(
                                      (acc, curr) => acc + +curr.credit_hour,
                                      0
                                    )
                                  ).toFixed(2)}
                                </td>
                              )}
                            </tr>
                          </React.Fragment>
                        ))}
                        <tr className="text-center fw-bold">
                          <td>Total</td>
                          <td>
                            {studentGroup.reduce(
                              (acc, curr) => acc + +curr.credit_hour,
                              0
                            )}
                          </td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>
                            {studentGroup
                              .reduce(
                                (acc, curr) =>
                                  acc +
                                  +(
                                    letterGrade.find(
                                      (grade) =>
                                        grade.marks <=
                                        (+curr.final_obtain_marks /
                                          +curr.final_total_marks) *
                                          100
                                    ).point * curr.credit_hour
                                  ),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>

                        <tr>
                          <td colspan="4">
                            Result:{" "}
                            {/* ({student.final_obtain_marks}/
                                {student.final_total_marks}) */}
                          </td>

                          <td colspan="4">Remarks:</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 pb-5">
                    <div className="d-flex gap-5">
                      <div className="">
                        Date of Publication :{" "}
                        <span className="border-bottom">4 Sept 2024</span>
                      </div>{" "}
                      <div>
                        Prepared by: Prof. Dr. Mohammad Musharof Hossain
                      </div>
                      <div></div>
                    </div>

                    <div className="d-flex justify-content-between mt-4 align-items-end  ">
                      <div className="d-flex">
                        <div className="w-50">
                          Date of Issue :{" "}
                          <span className="border-bottom"> 4 Aug 2024 </span>{" "}
                        </div>{" "}
                        <div>
                          Compared by: Prof. Dr. Mohammad Musharof Hossain
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="fw-bold">
                          Controller of Examination{" "}
                        </span>{" "}
                        <br />
                        <span>University of Chittagong</span>
                      </div>
                    </div>
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
