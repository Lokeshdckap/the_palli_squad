import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import invitePeople from "../../src/assets/images/addFriends.png";
import axios from "axios";
import TeamDrawer from "./TeamDrawer";

const TeamTableComponent = ({ data }) => {
  const [closeTab, setCloseTab] = useState(false);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("");
  const [record, setRecord] = useState("");

  const handleOpenClose = (index) => {
    setCloseTab(false);
    setClickedRowIndex(index);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleRowClick = (record, e) => {
    console.log(e.target.classList[0]);
    if (e.target.classList[0] == "ant-table-cell") {
      setRecord(record);
      setOpen(true);
      setPlacement("right");
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
    },
    {
      title: "Team name",
      dataIndex: "team_name",
    },
    {
      title: "Member count",
      dataIndex: "team_count",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record, index) => (
        <Button
          type="primary"
          className="bg-red-500"
          id="userAdd"
          onClick={() => {
            handleOpenClose(record.id);
            setCloseTab(true);
          }}
        >
          Add User
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowClassName={() => "pointer-cursor"} // Adding custom class to each row
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => handleRowClick(record, e), // Attaching onClick event to each row
          };
        }}
        bordered
        size="small"
      />
      <Modal
        // title="Invite Users to Team"
        visible={closeTab}
        footer={null}
        onCancel={handleOpenClose}
      >
        <InviteUsers
          closeTab={closeTab}
          handleOpenClose={handleOpenClose}
          setCloseTab={setCloseTab}
          clickedRowIndex={clickedRowIndex}
        />
      </Modal>
      <>
        {open && (
          <TeamDrawer
            placement={placement}
            open={open}
            onClose={onClose}
            record={record}
          />
        )}
      </>
    </>
  );
};

const InviteUsers = ({ setCloseTab, clickedRowIndex }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");

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
    if (role == "") {
      toast.error("Please assign the role");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("", {
        id: clickedRowIndex,
        email: inviteEmail,
        role: role,
      });
      console.log(response);
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
                <option value="" disabled>Select Role</option>
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
