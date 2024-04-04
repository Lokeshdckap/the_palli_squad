import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowDownOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select as AntSelect,
  Upload,
  Button,
  Space,
  Modal,
  AutoComplete,
} from "antd";
import SetPassword from "../Auth/SetPassword";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const { Option } = AntSelect;
const animatedComponents = makeAnimated();
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
  decryptedFileType,
  decryptedFileName,
  decryptedDescription,
  userList,
  teamList,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [showDescription, setshowDescription] = useState("");

  const [showAPIKey, setShowAPIKey] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectSecret, setSelectedSecret] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash_id = queryParams.get("hash_id");
  const navigate = useNavigate();
  const toggleVisibility = async (type, value, record) => {
    switch (type) {
      case "password":
        if (value == false) {
          setAuthUser(false);
          setShowPassword("");
        }
        setShowPassword(record.key);
        setIsModalOpen(value);
        break;
      case "attachments":
        if (value == false) {
          setAuthUser(false);
          setShowAttachments("");
        }
        setShowAttachments(record.key);
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
        return showPassword === record.key && authUser
          ? decryptedData
          : maskedText;
      case "description":
        return showDescription === record.key && authUser
          ? decryptedDescription
          : maskedText;
      case "attachments":
        return showAttachments === record.key && authUser
          ? decryptedFileName
          : maskedText;
      default:
        return truncatedText; // Default behavior if type is not recognized
    }
  };
  const getIcon = (type, record) => {
    switch (type) {
      case "password":
        return showPassword === record.key && authUser
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
            (
              record.description ? 
              <EyeInvisibleOutlined
                style={{ paddingLeft: "8px" }}
                onClick={() => toggleVisibility("description", true, record)}
              />:<>-</>
            ));
      case "attachments":
        return showAttachments === record.key && authUser ? (
          <ArrowDownOutlined
            style={{ marginLeft: "10px" }}
            onClick={() => downloadAttachments(false, record)}
          />
        ) : (
          record.attachments ?
          <EyeInvisibleOutlined
            style={{ paddingLeft: "8px" }}
            onClick={() => toggleVisibility("attachments", true, record)}
          />:<>-</>
        );
      default:
        return null;
    }
  };
  async function downloadAttachments(value, record) {
    toggleVisibility("attachments", value, record);

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
    console.log(secret,"jioj")
    const updatedData = secret.map((secrets) => ({
      id: secrets.uuid,
      key: secrets.uuid,
      username: secrets.username,
      title: secrets.title,
      password: secrets.password,
      attachments: secrets.encrypted_attachment_hex,
      description: secrets.description,
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

  const handleShareClick = (data) => {
    setVisible(true);
    setSelectedSecret(data.id);
  };
  const handleModalCancel = () => {
    setVisible(false);
  };
  const [timeValue, setTimeValue] = useState("");
  const [reactSelectValue, setReactSelectValue] = useState([]);
  const [timeValueTeam, setTimeValueTeam] = useState("");
  const [reactSelectValueTeam, setReactSelectValueTeam] = useState([]);

  const [timeOptions] = useState([
    { label: "5 minutes", value: "5 minutes" },
    { label: "15 minutes", value: "15 minutes" },
    { label: "30 minutes", value: "30 minutes" },
    { label: "1 hour", value: "1 hour" },
    { label: "More than 1 hour", value: "more" },
  ]);

  const handleTimeChange = (value) => {
    setTimeValue(value);
  };

  const handleTimeChangeTeam = (value) => {
    setTimeValueTeam(value);
  };

  const handleReactSelectChangeTeam = (value) => {
    setReactSelectValueTeam(value);
  };

  const handleReactSelectChange = (value) => {
    setReactSelectValue(value);
  };

  const handleShare = async () => {
    let payLoad = {
      email: reactSelectValue,
      time_limit: timeValue ? timeValue : timeValueTeam,
      team_uuid: reactSelectValueTeam,
      secret_uuid: selectSecret,
    };
    axiosClient
      .post("/api/shares/share-secrets", payLoad)
      .then((res) => {
        if (res.status === 200) {
          setReactSelectValue([]);
          setReactSelectValueTeam([]);
          setSelectedSecret(null);
          setTimeValue("");
          setTimeValueTeam("");
          setVisible(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
      dataIndex: "description",
      width: "15%",
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        <>
          <span>{renderContent(text, "description", record)}</span>
          <Link to={`/secrets/mysecrets/?hash_id=${record.id}`}>
            {getIcon("description", record)}
          </Link>
        </>
      ),
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
          <Link to={`/secrets/mysecrets/?hash_id=${record.id}`}>
            {getIcon("password", record)}
          </Link>
        </>
      ),
    },

    {
      title: "Attachments",
      dataIndex: "attachments",
      width: "25%",
      editable: true,
      ellipsis: true, // Enable ellipsis for long content
      render: (text, record) => (
        <>
          <span>{renderContent(text, "attachments", record)}</span>
          <Link to={`/secrets/mysecrets/?hash_id=${record.id}`}>
            {getIcon("attachments", record)}
          </Link>
        </>
      ),
    },

    {
      title: "Share",
      dataIndex: "share",
      width: "10%",
      render: (text, record) => (
        <Space size="large">
          <ShareAltOutlined
            onClick={() => handleShareClick(record)}
            style={{ fontSize: "20px" }}
          />
        </Space>
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
      <Modal
        title="Share Secrets Users and Teams"
        open={visible}
        onCancel={handleModalCancel}
        onOk={() => {
          handleShare();
        }}
        width={600}
        okText="Share"
      >
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px" }}>UserEmail : </span>
          <Select
            components={animatedComponents}
            defaultValue={""}
            isMulti
            name="colors"
            options={userList}
            className="basic-multi-select"
            classNamePrefix="select"
            value={reactSelectValue}
            onChange={handleReactSelectChange}
          />
          <span style={{ marginRight: "15px", marginLeft: "15px" }}>
            Time Limit :{" "}
          </span>
          <AntSelect
            style={{ width: 150 }}
            onChange={handleTimeChange}
            value={timeValue}
          >
            {timeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </AntSelect>
        </div>

        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px" }}>TeamName : </span>
          <Select
            components={animatedComponents}
            defaultValue={""}
            isMulti
            name="colors"
            options={teamList}
            className="basic-multi-select"
            classNamePrefix="select"
            value={reactSelectValueTeam}
            onChange={handleReactSelectChangeTeam}
          />

          <span style={{ marginRight: "15px", marginLeft: "15px" }}>
            Time Limit :{" "}
          </span>
          <AntSelect
            style={{ width: 150 }}
            onChange={handleTimeChangeTeam}
            value={timeValueTeam}
          >
            {timeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </AntSelect>
        </div>
      </Modal>
    </>
  );
};

export default SecretTable;
