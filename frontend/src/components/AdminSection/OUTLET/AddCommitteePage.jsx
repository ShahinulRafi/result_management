import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function AddCommitteePage() {
  //committee_id, committee_name, committee_chairman, session
  const [committeeID, setCommitteeID] = useState("");
  const [committeeName, setCommitteeName] = useState("");
  const [committeeChairman, setCommitteeChairman] = useState("");
  const [session, setSession] = useState("1st Year");

  const handleAddCommittee = () => {
    if (!committeeID || !committeeName || !committeeChairman || !session) {
      toast.error("Please fill all the fields");
      return;
    }
    // committee_id, committee_name, committee_chairman, session

    fetch("http://localhost:5000/admin/insertCommittee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        committee_id: committeeID,
        committee_name: committeeName,
        committee_chairman: committeeChairman,
        session,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setCommitteeID("");
          setCommitteeName("");
          setCommitteeChairman("");
          setSession("1st Year");
          getAllCommittee();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [commList, setCommList] = useState([]);
  const getAllCommittee = () => {
    fetch("http://localhost:5000/admin/allCommittees", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setCommList(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllCommittee();
  }, []);

  const handleDeleteCommmittee = (commmittee) => {
    toast(
      <div>
        <p>Are you sure you want to delete this Commmittee?</p>
        <button
          className="btn btn-danger p-0 px-3 me-2"
          onClick={() => deleteCommmittee(commmittee)}
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

  const deleteCommmittee = (commmittee) => {
    fetch("http://localhost:5000/admin/deleteCommittee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        committee_id: commmittee.committee_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getAllCommittee();
          toast.dismiss();
          toast.dismiss();
          toast.dismiss();
        } else {
          toast.error(data.message);
        }
      });
  };

  const handleDeleteCommmitteeMember = (commmitteeMember) => {
    toast(
      <div>
        <p>Are you sure you want to delete this Member?</p>
        <button
          className="btn btn-danger p-0 px-3 me-2"
          onClick={() => deleteCommmitteeMember(commmitteeMember)}
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

  const deleteCommmitteeMember = (commmitteeMember) => {
    fetch("http://localhost:5000/admin/deleteCommitteeMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        committee_id: committeeInformation?.committee_id,
        member: commmitteeMember.member,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getCommitteeInformation(committeeInformation?.committee_id);
          getAllCommittee();
          toast.dismiss();
          toast.dismiss();
          toast.dismiss();
        } else {
          toast.error(data.message);
        }
      });
  };

  const [committeeInformation, setCommitteeInformation] = useState([]);
  const getCommitteeInformation = (committee_id) => {
    fetch("http://localhost:5000/admin/committeeInformationById", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        committee_id: committee_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setCommitteeInformation(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  const [allCommMembers, setAllCommMembers] = useState([]);
  const getAllCommMembers = () => {
    fetch("http://localhost:5000/admin/allUsersBySingleRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        singleRole: "exam committee",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setAllCommMembers(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    getAllCommMembers();
  }, []);

  const addCommMember = (committee_id, member) => {
    fetch("http://localhost:5000/admin/insertCommitteeMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        committee_id,
        member,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          getCommitteeInformation(committee_id);
          setCommitteeChairman("");
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
            <label className="form-label">Committee ID</label>
            <input
              type="text"
              className="form-control"
              value={committeeID}
              onChange={(e) => setCommitteeID(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Committee Name</label>
            <input
              type="text"
              className="form-control"
              value={committeeName}
              onChange={(e) => setCommitteeName(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="form-label">Select Chairman</label>
            <select
              className="form-select py-1"
              value={committeeChairman}
              onChange={(e) => setCommitteeChairman(e.target.value)}
            >
              <option value="">Select Chairman</option>
              {allCommMembers.map((member) => (
                <option value={member.userId}>{member.full_name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleAddCommittee}>
            Save
          </button>
        </div>
        {/* userlist section */}
        <div className="col-8 border-start pt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6>
              <strong>Committee List</strong>
            </h6>
          </div>
          <hr className="m-0 p-0" />
          <div className="table-responsive mt-3">
            <table className="table table-bordered text-nowrap">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Committee ID</th>
                  <th>Committee Name</th>
                  <th>Chairman</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {commList.map((comm) => (
                  <tr key={comm?.id}>
                    <td>{comm?.session}</td>
                    <td>{comm?.committee_id}</td>
                    <td>{comm?.committee_name}</td>
                    <td>{comm?.committee_chairman}</td>
                    <td>
                      <i
                        className="fa fa-eye text-primary me-2 pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#commInfoModal"
                        onClick={() =>
                          getCommitteeInformation(comm.committee_id)
                        }
                      />
                      <i
                        className="fa fa-trash text-danger pointer"
                        onClick={() => handleDeleteCommmittee(comm)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Committee Information Modal */}
      <div
        className="modal fade"
        id="commInfoModal"
        tabIndex="-1"
        aria-labelledby="commInfoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commInfoModalLabel">
                Committee Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="card p-2">
                <h6>
                  {committeeInformation?.committee_id} -{" "}
                  {committeeInformation?.session}
                </h6>
                <h6>{committeeInformation?.committee_name}</h6>
                <h6>Chairman: {committeeInformation?.committee_chairman}</h6>
              </div>
              <div className="table-responsive mt-3">
                <table className="table table-bordered text-nowrap">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Member Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committeeInformation?.members?.map((member) => (
                      <tr key={member?.id}>
                        <td>{member?.member}</td>
                        <td>{member?.full_name}</td>
                        <td>
                          <i
                            className="fa fa-trash text-danger pointer"
                            onClick={() => handleDeleteCommmitteeMember(member)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <select
                    className="form-select py-1 me-2"
                    value={committeeChairman}
                    onChange={(e) => setCommitteeChairman(e.target.value)}
                  >
                    <option value="">Select Member</option>
                    {allCommMembers.map((member) => (
                      <option value={member.userId}>{member.full_name}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      addCommMember(
                        committeeInformation?.committee_id,
                        committeeChairman
                      )
                    }
                  >
                    Assign
                  </button>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
