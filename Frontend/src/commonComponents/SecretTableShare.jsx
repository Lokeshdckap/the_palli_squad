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
import CountdownTimer from "./CountdownTimer";

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

const SecretTableShare = ({
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
  decryptedDescription,
  decryptedFileType,
  decryptedFileName,
}) => {
  // console.log(secret);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAPIKey, setShowAPIKey] = useState(false);
  const [showDescription, setshowDescription] = useState("");

  const [showAttachments, setShowAttachments] = useState(false);

  console.log(decryptedData, "fr3f3");

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
      case "description":
        if (value == false) {
          setAuthUser(false);
          setshowDescription("");
        }
        setshowDescription(record.key);
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
        return showPassword && authUser ? decryptedData : maskedText;
      case "description":
        return showDescription === record.key && authUser
          ? decryptedDescription
          : maskedText;
      case "attachments":
        return showAttachments && authUser
          ? decryptedFileName.slice(0, 5)
          : maskedText;
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
      case "description":
        return showDescription === record.key && authUser
          ? (console.log("Rendering EyeOutlined"),
            (
              <EyeOutlined
                style={{ paddingLeft: "8px" }}
                onClick={() => toggleVisibility("description", false, record)}
              />
            ))
          : (console.log("Rendering EyeInvisibleOutlined"),
            record.description ? (
              <EyeInvisibleOutlined
                style={{ paddingLeft: "8px" }}
                onClick={() => toggleVisibility("description", true, record)}
              />
            ) : (
              <>-</>
            ));

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
  async function downloadAttachments(value,record) {
    toggleVisibility("attachments", value,record);

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
      dataIndex: "secret",
      width: "15%",
      editable: true,
      render: (text, record) => <span>{text.title}</span>,
    },
    {
      title: "Username",
      dataIndex: "secret",
      width: "12%",
      editable: true,
      render: (text, record) => <span>{text.username}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "15%",
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        <>
          <span>{renderContent(text, "description", record)}</span>
          <Link to={`/secrets/sharewithme/?hash_id=${record.id}`}>
            {getIcon("description", record)}
          </Link>
        </>
      ),
    },
    {
      title: "Password",
      dataIndex: "secret",
      width: "12%",
      editable: true,
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        <>
          <span>
            {renderContent(text.encrypted_password, "password", record)}
          </span>
          <Link to={`/secrets/sharewithme/?hash_id=${record.secret_uuid}`}>
            {getIcon("password", record)}
          </Link>
        </>
      ),
    },

    {
      title: "Attachments",
      dataIndex: "secret",
      width: "10%",
      editable: true,
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        console.log(text, "fjwroof"),
        (
          <>
            <span>{renderContent(text.encrypted_fileName, "attachments")}</span>
            <Link to={`/secrets/sharewithme/?hash_id=${record.secret_uuid}`}>
              {getIcon("attachments")}
            </Link>
          </>
        )
      ),
    },

    {
      title: "Shared by",
      dataIndex: "sharedWithUser",
      width: "15%",
      editable: false, // Assuming this is not editable
      render: (text, record) => <span>{record.sharedWithUser?.username}</span>,
    },
    {
      title: "expiration_date",
      dataIndex: "expiration_date",
      width: "12%",
      render: (text) => <CountdownTimer expirationDate={text} />,
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
          dataSource={secret}
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

export default SecretTableShare;
