import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
  Upload,
  Button,
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
      <Upload>
        <Button>Upload File</Button>
      </Upload>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: false,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {dataIndex === "attachments" ? (
            <Upload>
              <Button>Upload File</Button>
            </Upload>
          ) : (
            inputNode
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const SecretTableTeams = ({
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
  decryptedFileType,
  decryptedFileName,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAPIKey, setShowAPIKey] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash_id = queryParams.get("hash_id");

  const toggleVisibility = async (type, value, record) => {
    switch (type) {
      case "password":
        if (value == false) {
          setAuthUser(false);
        }
        setShowPassword(value);
        setIsModalOpen(value);
        break;
      case "apiKey":
        setShowAPIKey(!showAPIKey);
        break;
      case "attachments":
        if (value == false) {
          setAuthUser(false);
        }
        setShowAttachments(value);
        setIsModalOpen(value);
        break;
      default:
        break;
    }
  };
  const renderContent = (text, type, record) => {
    let truncatedText = "";
    if (typeof text === "string" || Array.isArray(text)) {
      truncatedText = text.slice(0, 10);
    }
    const maskedText = "*".repeat(truncatedText.length); // Masked text with asterisks

    switch (type) {
      case "password":
        return record.showPassword && authUser ? decryptedData : maskedText;
      // case "apiKey":
      //   return showAPIKey && authUser ? truncatedText : maskedText;
      case "attachments":
        return showAttachments && authUser ? decryptedFileName : maskedText;
      default:
        return truncatedText; // Default behavior if type is not recognized
    }
  };
  const getIcon = (type, record) => {
    switch (type) {
      case "password":
        return record.showPassword && authUser
          ? (console.log("Rendering EyeOutlined"),
            (
              <EyeOutlined
                style={{ paddingLeft: "8px" }}
                onClick={() => toggleVisibility("password", false, record)}
              />
            ))
          : (console.log("Rendering EyeInvisibleOutlined"),
            (
              <EyeInvisibleOutlined
                style={{ paddingLeft: "8px" }}
                onClick={() => toggleVisibility("password", true, record)}
              />
            ));

      // case "apiKey":
      //   return showAPIKey && authUser ? (
      //     <EyeOutlined
      //       style={{ paddingLeft: "8px" }}
      //       onClick={() => toggleVisibility("apiKey")}
      //     />
      //   ) : (
      //     <EyeInvisibleOutlined
      //       style={{ paddingLeft: "8px" }}
      //       onClick={() => toggleVisibility("apiKey")}
      //     />
      //   );

      case "attachments":
        return showAttachments && authUser ? (
          <ArrowDownOutlined
            style={{ marginLeft: "10px" }}
            onClick={() => downloadAttachments(false)}
          />
        ) : (
          <EyeInvisibleOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("attachments", true, record)}
          />
        );
      default:
        return null;
    }
  };
  async function downloadAttachments(value) {
    toggleVisibility("attachments", value);

    if (authUser) {
      const fileType = getFileType(decryptedFileType); // Extract file type from the file name

      const uint8Array = new Uint8Array(decryptedAttachments);

      const blob = new Blob([uint8Array], { type: fileType });
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = decryptedFileName;
      link.style.display = "none"; // Hide the link element
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setAuthUser(false);
    }
  }

  // Function to extract file type from the file name
  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop(); // Get the file extension
    // Map common extensions to MIME types (you may need to expand this list)
    const mimeTypeMap = {
      pdf: "application/pdf",
      txt: "text/plain",
      jpg: "image/jpeg",
      png: "image/png",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Add more mappings as needed
    };
    // Default to octet-stream if the extension is not recognized
    return mimeTypeMap[extension] || "application/octet-stream";
  };

  useEffect(() => {
    updateData();
  }, [secret]);

  const updateData = () => {
    const updatedData = secret.map((secrets) => ({
      id: secrets.uuid,
      key: secrets.uuid,
      username: secrets.username,
      title: secrets.title,
      password: secrets.password,
      attachments: secrets.encrypted_attachment_hex,
      showPassword: false,
    }));

    setData(updatedData);
  };

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

        const formData = new FormData();
        formData.append(
          "file",
          newData[index]?.attachments?.file?.originFileObj
        );
        formData.append("api_key", row["api key"]);
        formData.append("id", newData[index].id);
        formData.append("secretData", newData[index].password);
        formData.append("title", newData[index].title);
        formData.append("username", newData[index].username);

        axiosClient
          .put("/api/secrets/update-secret-encryption", formData)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {});

        setData(newData);
        setEditingKey("");
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
      .delete(`/api/secrets/removeSecrets/${key}`)
      .then((response) => {
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
      title: "Description",
      dataIndex: "Description",
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
      title: "Password",
      dataIndex: "password",
      width: "15%",
      editable: true,
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        <>
          <span>{renderContent(text, "password", record)}</span>
          <Link to={`/secrets/?hash_id=${record.id}`}>
            {getIcon("password", record)}
          </Link>
        </>
      ),
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
      title: "Share",
      dataIndex: "Share",
      width: "10%",
      //   render: (text) => (
      //     <span>
      //       {renderContent(text, "apiKey")}
      //       {getIcon("apiKey")}
      //     </span>
      //   ),
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

export default SecretTableTeams;
