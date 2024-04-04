import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
} from "antd";
import { useLocation } from "react-router-dom";



const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  editingKey,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "select" ? (
      <Select defaultValue={record?.user_team_members[0]?.role_type} style={{ width: "100%" }}>
        <Option value={1}>Admin</Option>
        <Option value={2}>Collaborator</Option>
        <Option value={3}>Viewer</Option>
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing && record.uuid === editingKey ? ( // Compare record.key with editingKey
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const TableUserComponent = ({ existUserList,assignRole }) => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamUuid = queryParams.get("team_uuid");
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const [teamMembers, setTeamMembers] = useState([]);


  const isEditing = (record) => record.uuid === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.uuid);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...teamMembers];
      const index = newData.findIndex((item) => key === item.uuid);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
  

        let payLoad = {
          team_uuid : teamUuid,
          role_type : newData[index].role_type,
          user_uuid : newData[index].uuid
        }
        axiosClient
          .put("/api/invites/updateRole", payLoad)
          .then((response) => {
            console.log("Update successful:", response.data);
            setTeamMembers(newData);
            setEditingKey("");
            allUsers()
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
      } else {
        console.error("Key not found in data array.");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const remove = (key) => {

    axiosClient
      .delete(`/api/teams/removeUserFromTeam?uuid=${key}&team_uuid=${teamUuid}`)
      .then((response) => {
        console.log("Deleted successful:", response.data);
            setEditingKey("");
            allUsers()
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
    const newData = data.filter((item) => item.uuid !== key);
    setTeamMembers(newData);
  };



  useEffect(() => {
    allUsers();
  }, [teamUuid]);

  const allUsers = () => {
    axiosClient
      .get(`/api/teams/getAciveUsers/${teamUuid}`)
      .then((res) => {
        setTeamMembers(res.data.userDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      title: "S.no",
      dataIndex: "uuid",
      width: "5%",
      render: (_, record, index) => index + 1,
      editable: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "15%",
      editable: false,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "25%",
      editable: false,
    },
    {
      title: "Role",
      dataIndex: "role_type",
      width: "15%",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <EditableCell
            editing
            dataIndex="role_type"
            title="Role"
            inputType="select"
            defaultValue="Admin"
            record={record}
            index={record.uuid}
            editingKey={editingKey}
          />
        ) : record.user_team_members[0]?.role_type === 1 ? (
          "Admin"
        ) : record.user_team_members[0]?.role_type === 2 ? (
          "Collaborator"
        ) : record.user_team_members[0]?.role_type === 3 ? (
          "Viewer"
        ) : "null",
    },

    {
      title: "Operation",
      dataIndex: "Operation",
      width: "10%",
      render: (_, record) => {
        if (assignRole && assignRole != 1) {
          return (
            <Typography.Link disabled>
              No Permission
            </Typography.Link>
          );
        }
    
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.uuid)}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a style={{ paddingLeft: "10px" }}>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: "Remove",
      dataIndex: "Remove",
      width: "10%",
      render: (_, record) => {
        if (assignRole && assignRole !== 1) {
          console.log(assignRole,"fwef")
          return (
            <Typography.Link disabled>
              No Permission
            </Typography.Link>
          );
        }
    
        return (
          <Popconfirm
            title="Sure to remove?"
            onConfirm={() => remove(record.uuid)}
          >
            <a style={{ color: "red" }}>Remove</a>
          </Popconfirm>
        );
      },
    },
    
    
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "role_type" ? "select" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        editingKey,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={teamMembers}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default TableUserComponent;



