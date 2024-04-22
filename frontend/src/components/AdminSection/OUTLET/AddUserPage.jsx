import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function AddUserPage() {
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [isExternal, setIsExternal] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState([]);

  const handleAddUser = () => {
    console.log(userId, fullName, email, phone, role, isExternal);
    if (role.length === 0) {
      toast.error("Please select a role");
      return;
    }
    if (!userId || !fullName || !email || !phone) {
      toast.error("Please fill all the fields");
      return;
    }
    // userId, password, full_name, is_external, email, phone, role
    fetch("http://localhost:5000/server/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        full_name: fullName,
        email,
        phone,
        role: JSON.stringify(role.map((r) => r.value)),
        is_external: isExternal,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setUserId("");
          setFullName("");
          setEmail("");
          setPhone("");
          setRole([]);
          setIsExternal(0);
          setPassword("");
          getAllUsers();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [users, setUsers] = useState([]);
  const getAllUsers = () => {
    fetch("http://localhost:5000/admin/allUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setUsers(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDeleteUser = (user) => {
    toast(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <button
          className="btn btn-danger p-0 px-3 me-2"
          onClick={() => deleteUser(user)}
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

  const deleteUser = (user) => {
    fetch("http://localhost:5000/admin/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getAllUsers();
          toast.dismiss();
          toast.dismiss();
          toast.dismiss();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [isEditable, setIsEditable] = useState(false);
  const handleEditUser = (user) => {
    setUserId(user?.userId);
    setFullName(user?.full_name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setRole(JSON.parse(user?.role).map((r) => ({ value: r, label: r })));
    setIsExternal(user?.is_external);
    setIsEditable(true);
  };

  const cancelEditUser = () => {
    setUserId("");
    setFullName("");
    setEmail("");
    setPhone("");
    setRole([]);
    setIsExternal(0);
    setIsEditable(false);
  };

  const handleUpdateUser = () => {
    if (role.length === 0) {
      toast.error("Please select a role");
      return;
    }
    if (!userId || !fullName || !email || !phone) {
      toast.error("Please fill all the fields");
      return;
    }
    // userId, password, full_name, is_external, email, phone, role
    fetch("http://localhost:5000/admin/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        full_name: fullName,
        email,
        phone,
        role: JSON.stringify(role.map((r) => r.value)),
        is_external: isExternal,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setUserId("");
          setFullName("");
          setEmail("");
          setPhone("");
          setRole([]);
          setIsExternal(0);
          setPassword("");
          setIsEditable(false);
          getAllUsers();
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
    fetch("http://localhost:5000/server/registrationBulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allUsers: bulkUsers,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setBulkUsers([]);
          setBulkFile(null);
          getAllUsers();
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
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Role</label>

            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "teacher", label: "Teacher" },
                { value: "exam committee", label: "Exam Committee" },
              ]}
              isMulti
              value={role}
              onChange={(selectedOption) => setRole(selectedOption)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">External</label>
            <input
              className="form-check-input"
              type="checkbox"
              value={isExternal}
              onChange={(e) => setIsExternal(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">User ID</label>
            <input
              className="form-control"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
              Add User
            </button>
          )}
        </div>
        {/* userlist section */}
        <div className="col-8 border-start pt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6>
              <strong>User List</strong>
            </h6>
            <div>
              {/* <button
                className="btn btn-info"
                data-bs-toggle="modal"
                data-bs-target="#bulkModal"
              >
                Bulk Insert
              </button> */}
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
            <table className="table table-bordered text-nowrap">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user?.id}>
                    <td>{user?.userId}</td>
                    <td>{user?.full_name}</td>
                    <td>{user?.email}</td>
                    <td>{user?.phone}</td>
                    <td>
                      {user?.role &&
                        JSON.parse(user?.role).map((roleName, index) => (
                          <span
                            className="text-capitalize border rounded px-2 py-1 mx-1 text-nowrap bg-light "
                            key={index}
                          >
                            {roleName}
                          </span>
                        ))}
                    </td>
                    <td>{user?.is_external === 1 ? "External" : "Internal"}</td>
                    <td>
                      <i
                        className="fa fa-edit text-primary pointer mx-1"
                        onClick={() => handleEditUser(user)}
                      />
                      <i
                        className="fa fa-trash text-danger pointer"
                        onClick={() => handleDeleteUser(user)}
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
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkUsers &&
                      bulkUsers.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={user?.userId}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "userId");
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={user?.full_name}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "full_name");
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={user?.email}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "email");
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={user?.phone}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "phone");
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="w-100 border-0 shadow-none focus-none form-control"
                              value={user?.role}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "role");
                              }}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select-sm"
                              value={user?.is_external}
                              onChange={(e) => {
                                handleCSVEdit(e, index, "is_external");
                              }}
                            >
                              <option value={0}>Internal</option>
                              <option value={1}>External</option>
                            </select>
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
