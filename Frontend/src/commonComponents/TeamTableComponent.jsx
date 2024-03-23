import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import invitePeople from "../../src/assets/images/addFriends.png";
import axios from "axios";

const TeamTableComponent = ({ data }) => {
  const [closeTab, setCloseTab] = useState(false);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);

  const handleOpenClose = (index) => {
    setCloseTab(false);
    setClickedRowIndex(index);
  }

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
        <Button type="primary" className="bg-red-500" onClick={() => { handleOpenClose(record.id); setCloseTab(true) }}>
          Add User
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} bordered size="small" />
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
    </>
  );
};

const InviteUsers = ({ setCloseTab, clickedRowIndex }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInviteEmail(value);
    } else if (name === "role") {
      setRole(value);
    }
  }

  const handleInviteUsers = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {

      const response = await axios.post("", { id: clickedRowIndex, email: inviteEmail, role: role })
      console.log(response)
      toast.success("Email sent Successfully");
      setInviteEmail("");
      setRole("");
      setCloseTab(false);

    }
    catch (error) {
      console.error(error);
      toast.error("Failed to send invitation");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="relative">
        <div className='rounded-md w-full max-w-md mx-auto py-2'>
          <div className="flex justify-around items-center">
            <h1 className="text-xl">Invite users to join the team</h1>
          </div>
          <img src={invitePeople} className="m-auto w-3/4 py-5" alt="Invite people" />
          <form onSubmit={handleInviteUsers} className="mx-auto w-full">
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
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="collaborator">Collaborator</option>
              </select>
              <Button type="primary" htmlType="submit" loading={loading} className="bg-red-500">
                {loading ? "Sending..." : "Invite"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TeamTableComponent;
