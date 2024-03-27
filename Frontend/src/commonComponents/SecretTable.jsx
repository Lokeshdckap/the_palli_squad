import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
} from "antd";
import SetPassword from "../Auth/SetPassword";
import { Link, useLocation, useParams } from "react-router-dom";

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
  const inputNode =
    inputType === "number" ? (
      <Input type="number" />
    ) : inputType === "select" ? (
      <Select defaultValue={record[dataIndex]}>
        <Option value={0}>User</Option>
        <Option value={1}>Super Admin</Option>
      </Select>
    ) : inputType === "file" ? (
      <Input type="file" />
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

const SecretTable = ({
  secret,
  setPassword,
  password,
  handleInputChange,
  handleSubmit,
  setError,
  error,
  showModal,
  handleOk,
  handleCancel,
  setIsModalOpen,
  isModalOpen,
  authUser,
  setAuthUser,
  decryptedData,
  decryptedAttachments,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showAPIKey, setShowAPIKey] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const params = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash_id = queryParams.get("hash_id");

  const toggleVisibility = async (type) => {
    showModal();
    switch (type) {
      case "password":
        setIsModalOpen(!showPassword);
        setShowPassword(!showPassword);
        break;
      case "apiKey":
        setIsModalOpen(!showAPIKey);
        setShowAPIKey(!showAPIKey);
        break;
      case "attachments":
        setIsModalOpen(!showAttachments);
        setShowAttachments(!showAttachments);
        break;
      default:
        break;
    }
  };

  const renderContent = (text, type) => {
    console.log(decryptedAttachments);
    const truncatedText = text.slice(0, 10); // Truncate text to 20 characters
    const maskedText = "*".repeat(truncatedText.length); // Masked text with asterisks
    switch (type) {
      case "password":
        return showPassword && authUser ? decryptedData : maskedText;
      case "apiKey":
        return showAPIKey && authUser ? truncatedText : maskedText;
      case "attachments":
        return showAttachments && authUser ? decryptedAttachments : maskedText;
      default:
        return truncatedText; // Default behavior if type is not recognized
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "password":
        return showPassword && authUser ? (
          <EyeOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("password")}
          />
        ) : (
          <EyeInvisibleOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("password")}
          />
        );
      case "apiKey":
        return showAPIKey && authUser ? (
          <EyeOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("apiKey")}
          />
        ) : (
          <EyeInvisibleOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("apiKey")}
          />
        );

      case "attachments":
        return showAttachments && authUser ? (
          <EyeOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("attachments")}
          />
        ) : (
          <EyeInvisibleOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("attachments")}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Update data when existUserList changes
    setData(
      secret.map((secrets) => ({
        id: secrets.uuid,
        key: secrets.uuid,
        username: secrets.username,
        title: secrets.title,
        password: secrets.password,
        attachments: secrets.encrypted_attachment_hex,
      }))
    );
  }, [secret]);

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
      width: "10%",
      render: (_, record, index) => index + 1,
      editable: false,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: "15%",
      editable: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "15%",
      editable: true,
    },
    {
      title: "Password",
      dataIndex: "password",
      width: "15%",
      editable: true,
      ellipsis: true, // Enable ellipsis for long content
      // render: (text) => <div style={{ maxWidth: 150 }}>{text}</div>,

      render: (text, record) => (
        <>
          <span>{renderContent(text, "password")}</span>
          <Link to={`/secrets/?hash_id=${record.id}`}>
            {getIcon("password")}
          </Link>
        </>
      ),
    },
    {
      title: "API KEY",
      dataIndex: "api key",
      width: "15%",
      editable: true,
      //   render: (text) => (
      //     <span>
      //       {renderContent(text, "apiKey")}
      //       {getIcon("apiKey")}
      //     </span>
      //   ),
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      width: "15%",
      editable: true,
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        <>
          <span>{renderContent(text, "attachments")}</span>
          <Link to={`/secrets/?hash_id=${record.id}`}>
            {getIcon("attachments")}
          </Link>
        </>
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
    <>
      <SetPassword
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        setPassword={setPassword}
        password={password}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setError={setError}
        error={error}
        showModal={showModal}
      />
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
    </>
  );
};

export default SecretTable;
