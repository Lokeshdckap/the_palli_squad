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

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const defaultValue =
    inputType === "select" && editing
      ? record.role_type === 0
        ? 1 // If role_type is User, set default value to Super Admin (1)
        : 0 // If role_type is Super Admin, set default value to User (0)
      : undefined;

  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "select" ? (
      <Select defaultValue={defaultValue}>
        <Option value={0}>User</Option>
        <Option value={1}>Super Admin</Option>
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
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

const TableComponent = ({ existUserList }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    // Update data when existUserList changes
    setData(
      existUserList.map((user) => ({
        key: user.uuid,
        username: user.username,
        email: user.email,
        role_type: user.role_type,
      }))
    );
  }, [existUserList]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        console.log(newData[index]);
        // Perform POST request to update data on the server

        axiosClient
          .put("/api/superAdmin/updateUsers", newData[index])
          .then((response) => {
            console.log("Update successful:", response.data);
            setData(newData);
            setEditingKey("");
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
      } else {
        // If index is -1, it means the key was not found, handle accordingly
        console.error("Key not found in data array.");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const remove = (key) => {
    axiosClient
      .delete(`/api/superAdmin/existingUserRemove?uuid=${key}`)
      .then((response) => {
        console.log("deleted successful:", response.data);
        setData(newData);
        setEditingKey("");
      })
      .catch((error) => {
        console.error("Error deleted data:", error);
      });
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const columns = [
    {
      title: "S.no",
      dataIndex: "key",
      width: "5%",
      render: (_, record, index) => index + 1,
      editable: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "15%",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "25%",
      editable: true,
    },
    {
      title: "Role",
      dataIndex: "role_type",
      width: "10%",
      editable: true,
      render: (_, record) =>
        isEditing(record) ? (
          <EditableCell
            editing
            dataIndex="role_type"
            title="Role"
            inputType="select"
            defaultValue="user"
            record={record}
          />
        ) : record.role_type === 0 ? (
          "User"
        ) : (
          "Super Admin"
        ),
    },
    {
      title: "Operation",
      dataIndex: "Operation",
      width: "10%",

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)}>
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
      render: (_, record) => (
        <Popconfirm
          title="Sure to remove?"
          onConfirm={() => remove(record.key)}
        >
          <a style={{ color: "red" }}>Remove</a>
        </Popconfirm>
      ),
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
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default TableComponent;
