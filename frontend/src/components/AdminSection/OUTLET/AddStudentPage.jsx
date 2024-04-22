import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function AddStudentPage() {
  // student_id, full_name, session
  const [studentID, setStudentID] = useState("");
  const [fullName, setFullName] = useState("");
  const [session, setSession] = useState("1st Year");

  const handleAddUser = () => {
    if (!studentID || !fullName || !session) {
      toast.error("Please fill all the fields");
      return;
    }
    // student_id, full_name, session
    fetch("http://localhost:5000/admin/insertStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentID,
        full_name: fullName,
        session,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setStudentID("");
          setFullName("");
          setSession("");
          getAllStudentBySession();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [students, setStudents] = useState([]);
  const getAllStudentBySession = () => {
    fetch("http://localhost:5000/admin/allStudentsBySession", {
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
          setStudents(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllStudentBySession();
  }, [session]);

  const handleDeleteStudent = (user) => {
    toast(
      <div>
        <p>Are you sure you want to delete this student?</p>
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

  const deleteStudent = (student) => {
    fetch("http://localhost:5000/admin/deleteStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: student?.student_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getAllStudentBySession();
          toast.dismiss();
          toast.dismiss();
          toast.dismiss();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [isEditable, setIsEditable] = useState(false);
  const handleEditStudent = (student) => {
    setStudentID(student?.student_id);
    setFullName(student?.full_name);
    setSession(student?.session);
    setIsEditable(true);
  };

  const cancelEditUser = () => {
    setStudentID("");
    setFullName("");
    setSession("");
    setIsEditable(false);
  };

  const handleUpdateUser = () => {
    if (!studentID || !fullName || !session) {
      toast.error("Please fill all the fields");
      return;
    }
    fetch("http://localhost:5000/admin/updateStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentID,
        full_name: fullName,
        session,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setStudentID("");
          setFullName("");
          setSession("");
          setIsEditable(false);
          getAllStudentBySession();
        } else {
          toast.error(data.message);
        }
      });
  };

  const handleCSVEdit = (e, index, key) => {
    const newBulkUsers = [...bulkUsers];
    newBulkUsers[index][key] = e.target.value;
    setBulkUsers(newBulkUsers);
  };

  const [bulkUsers, setBulkUsers] = useState([]);
  const [bulkFile, setBulkFile] = useState(null);
  const handleBulkInsert = () => {
    if (!bulkFile) {
      toast.error("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
        dateNF: "yyy-mm-dd",
      });
      setBulkUsers(parsedData);
      console.log(bulkUsers);
    };
    reader.readAsArrayBuffer(bulkFile);
  };

  const saveBulkInsert = () => {
    fetch("http://localhost:5000/admin/insertBulkStudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allStudents: bulkUsers,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getAllStudentBySession();
          setBulkUsers([]);
          setBulkFile(null);
          document.getElementById("bulkModal").click();
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
            <label className="form-label">Student ID</label>
            <input
              className="form-control"
              type="text"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
                onClick={handleUpdateUser}
              >
                Update User
              </button>
              <button className="btn btn-secondary" onClick={cancelEditUser}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAddUser}>
              Add Student
            </button>
          )}
        </div>
        {/* userlist section */}
        <div className="col-8 border-start pt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6>
              <strong>Student List</strong>
            </h6>
            <div>
              <button
                className="btn btn-info d-none"
                // hide bulk
                data-bs-toggle="modal"
                data-bs-target="#bulkModal"
              >
                Bulk Insert
              </button>
              {/* <div className="d-flex">
                <input
                  className="form-control m-0 p-1"
                  type="file"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                />
                <button
                  className="btn btn-primary ms-2"
                  onClick={handleBulkInsert}
                >
                  Upload
                </button>
              </div> */}
            </div>
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
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Session</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((user) => (
                  <tr key={user?.id}>
                    <td>{user?.student_id}</td>
                    <td>{user?.full_name}</td>
                    <td>{user?.session}</td>

                    <td>
                      <i
                        className="fa fa-edit text-primary pointer mx-1"
                        onClick={() => handleEditStudent(user)}
                      />
                      <i
                        className="fa fa-trash text-danger pointer"
                        onClick={() => handleDeleteStudent(user)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="bulkModal"
        tabIndex="-1"
        aria-labelledby="bulkModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bulkModalLabel">
                Bulk Insert
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex">
                <input
                  className="form-control m-0 p-1"
                  type="file"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                />
                <button
                  className="btn btn-primary ms-2"
                  onClick={handleBulkInsert}
                >
                  Upload
                </button>
              </div>
              <div className="my-2">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Full Name</th>
                      <th>Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkUsers &&
                      bulkUsers.map((student, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={student?.student_id}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "student_id");
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={student?.full_name}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "full_name");
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={student?.session}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "session");
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveBulkInsert}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
