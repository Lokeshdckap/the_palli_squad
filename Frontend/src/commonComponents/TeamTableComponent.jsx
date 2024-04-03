import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TeamDrawer from "./TeamDrawer";
import moment from "moment";
import "moment-timezone";
import { formatDistanceToNow, isValid } from "date-fns";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
const TeamTableComponent = ({ teamList }) => {
  const [closeTab, setCloseTab] = useState(false);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(null); // Changed initial value to null
  const [assignRole,setAssignRole] = useState(null);
 const navigate = useNavigate()

 const location = useLocation();
 const queryParams = new URLSearchParams(location.search);
 const teamUuid = queryParams.get('team_uuid');
  const handleOpenClose = (index) => {
    setCloseTab(!closeTab); // Toggle closeTab state
    setClickedRowIndex(index.team_uuid);
  };

  const handleRowClick = (record, e) => {
    navigate(`/teams/?team_uuid=${record.team_uuid}`);
    if (e.target.classList.contains("ant-table-cell")) {
      setRecord(record);
      setOpen(true);
    }
    team()
  };


  const team = () => {
    axiosClient
      .get(`/api/teams/getTeam/${teamUuid}`)
      .then((res) => {
        setAssignRole(res.data.team_member.role_type);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
      editable: false,
    },
    {
      title: "Team name",
      dataIndex: "name",
    },
    {
      title: "Member count",
      dataIndex: "team_count",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => {
        let formattedTime = ""; // Initialize formattedTime variable

        if (isValid(new Date(createdAt))) {
          formattedTime = formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
          });
        }

        return <span>{formattedTime}</span>;
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt) => {
        let formattedTime = ""; // Initialize formattedTime variable

        if (isValid(new Date(updatedAt))) {
          formattedTime = formatDistanceToNow(new Date(updatedAt), {
            addSuffix: true,
          });
        }

        return <span>{formattedTime}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record, index) => {
        if (record.role_type == 3 || record.role_type == 2) {
          return (
            <Button
              type="primary"
              className="bg-red-500"
              disabled // Disable the button
            > 
              Add User
            </Button>
          );
        } else {
          return (
            <Button
              type="primary"
              className="bg-red-500"
              id="userAdd"
              onClick={() => {
                handleOpenClose(record);
                setCloseTab(true);
              }}
            >
              Add User
            </Button>
          );
        }
      },
    },
    
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={teamList}
        rowClassName={() => "pointer-cursor"} // Adding custom class to each row
        onRow={(record) => ({
          onClick: (e) => handleRowClick(record, e), // Attaching onClick event to each row
        })}
        bordered
        size="small"
      />
      <Modal
        visible={closeTab}
        footer={null}
        onCancel={() => setCloseTab(false)} // Close the modal by toggling closeTab
      >
        <InviteUsers
          closeTab={closeTab}
          handleOpenClose={handleOpenClose}
          setCloseTab={setCloseTab}
          clickedRowIndex={clickedRowIndex}
        />
      </Modal>
      {open && record && (
        <TeamDrawer
          placement="right"
          open={open}
          onClose={onClose}
          record={record}
          assignRole={assignRole}
        />
      )}
    </>
  );
};

const InviteUsers = ({
  closeTab,
  handleOpenClose,
  setCloseTab,
  clickedRowIndex,
}) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInviteEmail(value);
    } else if (name === "role") {
      setRole(value);
    }
  };

  const handleInviteUsers = async (e) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    if (!role) {
      toast.error("Please assign the role");
      return;
    }

    setLoading(true);

    try {

      let payload = {
        email: inviteEmail,
        role_id: role,
        team_uuid : clickedRowIndex,
      }
      console.log(payload)
      axiosClient
          .post("/api/invites/inviteUsers",payload)
          .then((res) => {
            console.log(res.data);
            navigate("/dashboard");
          })
          .catch((err) => {
            console.log(err);
          });
      toast.success("Email sent Successfully");
      setInviteEmail("");
      setRole("");
      setCloseTab(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send invitation");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="relative">
        {/* <div className="rounded-md w-full max-w-md mx-auto py-2"> */}
        <div className="flex justify-around items-center">
          <h1 className="text-xl">Invite users to join the team</h1>
        </div>
        {/* <img src={invitePeople} className="m-auto w-3/4 py-5" alt="Invite people" /> */}
        <form onSubmit={handleInviteUsers} className="mx-auto w-full my-4">
          <div className="flex items-center justify-center gap-3">
            <label className="pr-3 text-[16px]">Email:</label>
            <input
              placeholder="Enter Email"
              type="email"
              className="h-10 w-60 px-2 border rounded-md"
              name="email"
              value={inviteEmail}
              onChange={handleChange}
            />
            <select
              value={role}
              onChange={handleChange}
              name="role"
              className="h-10 w-32 px-2 border rounded-md"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="1">Admin</option>
              <option value="2">Collaborator</option>
              <option value="3">Viewer</option>
            </select>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-red-500"
            >
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
        </form>
        {/* </div> */}
      </div>
    </>
  );
};

export default TeamTableComponent;
