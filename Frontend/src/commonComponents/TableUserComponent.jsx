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
      <Select defaultValue={record.user_team_members[0]?.role_type} style={{ width: "100%" }}>
        <Option value={1}>Admin</Option>
        <Option value={2}>Collaborator</Option>
        <Option value={3}>Viewer</Option>
      </Select>
    ) : (
      <Input />
    );



    console.log(record )
    console.log(editingKey)
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
const TableUserComponent = ({ existUserList }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

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

        console.log(newData[index])

        return

        axiosClient
          .put("/api/invite//updateRole", newData[index])
          .then((response) => {
            console.log("Update successful:", response.data);
            setTeamMembers(newData);
            setEditingKey("");
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
      .delete(`/api/superAdmin/existingUserRemove?uuid=${key}`)
      .then((response) => {
        console.log("Deleted successful:", response.data);
        setData(newData);
        setEditingKey("");
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamUuid = queryParams.get("team_uuid");
  const [teamMembers, setTeamMembers] = useState([]);

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
      render: (_, record) => (
        <Popconfirm
          title="Sure to remove?"
          onConfirm={() => remove(record.uuid)}
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



// import React, { useState, useEffect } from "react";
// import axiosClient from "../axios-client";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Popconfirm,
//   Table,
//   Typography,
//   Select,
// } from "antd";
// import { useLocation } from "react-router-dom";

// const { Option } = Select;

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   editingKey,
//   ...restProps
// }) => {
//   const inputNode =
//     inputType === "number" ? (
//       <InputNumber />
//     ) : inputType === "select" && editing ? (
//       <Select defaultValue={record.user_team_members[0]?.role_type} style={{ width: "100%" }}>
//         <Option value={1}>Admin</Option>
//         <Option value={2}>Collaborator</Option>
//         <Option value={3}>Viewer</Option>
//       </Select>
//     ) : (
//       <Input />
//     );

//   return (
//     <td {...restProps}>
//     {editing ? (
//       <Form.Item
//         name={dataIndex}
//         style={{
//           margin: 0,
//         }}
//         rules={[
//           {
//             required: true,
//             message: `Please Input ${title}!`,
//           },
//         ]}
//       >
//         {inputNode}
//       </Form.Item>
//     ) : (
//       children
//     )}
//   </td>
//   );
// };






// const TableUserComponent = ({ existUserList }) => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);
//   const [editingKey, setEditingKey] = useState("");


//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({
//       ...record,
//     });
//     setEditingKey(record.key);
//   };

//   const cancel = () => {
//     setEditingKey("");
//   };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, {
//           ...item,
//           ...row,
//         });

//         console.log(newData[index]);
//         // Perform POST request to update data on the server

//         axiosClient
//           .put("/api/superAdmin/approvalForNewSignups", newData[index])
//           .then((response) => {
//             console.log("Update successful:", response.data);
//             setData(newData);
//             setEditingKey("");
//           })
//           .catch((error) => {
//             console.error("Error updating data:", error);
//           });
//       } else {

//         console.error("Key not found in data array.");
//       }
//     } catch (errInfo) {
//       console.log("Validate Failed:", errInfo);
//     }
//   };

//   const remove = (key) => {
//     axiosClient
//       .delete(`/api/superAdmin/existingUserRemove?uuid=${key}`)
//       .then((response) => {
//         console.log("deleted successful:", response.data);
//         setData(newData);
//         setEditingKey("");
//       })
//       .catch((error) => {
//         console.error("Error deleted data:", error);
//       });
//     const newData = data.filter((item) => item.key !== key);
//     setData(newData);
//   };

//     const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const teamUuid = queryParams.get("team_uuid");
//   const [teamMembers, setTeamMembers] = useState([]);

//   useEffect(() => {
//     allUsers();
//   }, [teamUuid]);

//   const allUsers = () => {
//     axiosClient
//       .get(`/api/teams/getAciveUsers/${teamUuid}`)
//       .then((res) => {
//         setTeamMembers(res.data.userDetail);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const columns = [
//     {
//       title: "S.no",
//       dataIndex: "key",
//       width: "5%",
//       render: (_, record, index) => index + 1,
//       editable: false,
//     },
//     {
//       title: "Username",
//       dataIndex: "username",
//       width: "15%",
//       editable: false,
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       width: "25%",
//       editable: false,
//     },
//     {
//       title: "Role",
//       dataIndex: "role_type",
//       width: "15%",
//       editable: true,
//       render: (_, record) =>
//       isEditing(record) ? (
//         <EditableCell
//           editing
//           dataIndex="role_type"
//           title="Role"
//           inputType="select"
//           defaultValue="Admin"
//           record={record}
//         />
//       ) : record?.user_team_members[0]?.role_type == 1 ? (
//         "Admin"
//       ) : record?.user_team_members[0]?.role_type == 2 ? (
//         "Collaborator"
//       ) : record?.user_team_members[0]?.role_type == 3 ? (
//         "Viewer"
//       ) : "null"
    
//     },
//     {
//       title: "Operation",
//       dataIndex: "Operation",
//       width: "10%",

//       render: (_, record) => {
//         const editable = isEditing(record);
//         return editable ? (
//           <span>
//             <Typography.Link onClick={() => save(record.key)}>
//               Save
//             </Typography.Link>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a style={{ paddingLeft: "10px" }}>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <Typography.Link
//             disabled={editingKey !== ""}
//             onClick={() => edit(record)}
//           >
//             Edit
//           </Typography.Link>
//         );
//       },
//     },
//     {
//       title: "Remove",
//       dataIndex: "Remove",
//       width: "10%",
//       render: (_, record) => (
//         <Popconfirm
//           title="Sure to remove?"
//           onConfirm={() => remove(record.key)}
//         >
//           <a style={{ color: "red" }}>Remove</a>
//         </Popconfirm>
//       ),
//     },
//   ];

//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         inputType: col.dataIndex === "role_type" ? "select" : "text",
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });

//   return (
//     <Form form={form} component={false}>
//       <Table
//         components={{
//           body: {
//             cell: EditableCell,
//           },
//         }}
//         bordered
//         dataSource={teamMembers}
//         columns={mergedColumns}
//         rowClassName="editable-row"
//         pagination={{
//           onChange: cancel,
//         }}
//       />
//     </Form>
//   );
// };

// export default TableUserComponent;




// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axiosClient from "../axios-client";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Popconfirm,
//   Table,
//   Typography,
//   Select,
// } from "antd";

// const { Option } = Select;

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const defaultValue =
//     inputType === "select" && editing
//       ? record.role_type === 0
//         ? 1
//         : 0
//       : undefined;

//   const inputNode =
//     inputType === "number" ? (
//       <InputNumber />
//     ) : inputType === "select" ? (
//       <Select defaultValue={defaultValue}>
//         <Option value={0}>Waiting for Approval</Option>
//         <Option value={1}>Approved</Option>
//         <Option value={2}>Rejected</Option>
//       </Select>
//     ) : (
//       <Input />
//     );

//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{ margin: 0 }}
//           rules={[{ required: true, message: `Please Input ${title}!` }]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

// const TableUserComponent = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);
//   const [editingKey, setEditingKey] = useState("");

//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({ ...record });
//     setEditingKey(record.key);
//   };

//   const cancel = () => {
//     setEditingKey("");
//   };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, { ...item, ...row });

//         axiosClient
//           .put("/api/superAdmin/approvalForNewSignups", newData[index])
//           .then((response) => {
//             console.log("Update successful:", response.data);
//             setData(newData);
//             setEditingKey("");
//           })
//           .catch((error) => {
//             console.error("Error updating data:", error);
//           });
//       } else {
//         console.error("Key not found in data array.");
//       }
//     } catch (errInfo) {
//       console.log("Validate Failed:", errInfo);
//     }
//   };

//   const remove = (key) => {
//     axiosClient
//       .delete(`/api/superAdmin/existingUserRemove?uuid=${key}`)
//       .then((response) => {
//         console.log("Deleted successful:", response.data);
//         setData(newData);
//         setEditingKey("");
//       })
//       .catch((error) => {
//         console.error("Error deleting data:", error);
//       });
//     const newData = data.filter((item) => item.key !== key);
//     setData(newData);
//   };



//   const columns = [
//     {
//       title: "S.No",
//       dataIndex: "id",
//       render: (_, record, index) => index + 1,
//       editable: false,
//     },
//     { title: "Name", dataIndex: "username" },
//     { title: "Email", dataIndex: "email" },
//     {
//       title: "Role",
//       dataIndex: "role_type",
//       editable: true,
//       render: (text, record) => (
//         <span>
//           {record.user_team_members[0]?.role_type === 1
//             ? "Admin"
//             : record.user_team_members[0]?.role_type === 2
//             ? "Collaborator"
//             : "Viewer"}
//         </span>
//       ),
//     },
//     {
//       title: "Operation",
//       dataIndex: "Operation",
//       width: "10%",
//       render: (_, record) => {
//         const editable = isEditing(record);
//         return editable ? (
//           <span>
//             <Typography.Link onClick={() => save(record.key)}>
//               Save
//             </Typography.Link>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a style={{ paddingLeft: "10px" }}>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <Typography.Link
//             disabled={editingKey !== ""}
//             onClick={() => edit(record)}
//           >
//             Edit
//           </Typography.Link>
//         );
//       },
//     },
//     {
//       title: "Remove",
//       dataIndex: "Remove",
//       width: "10%",
//       render: (_, record) => (
//         <Popconfirm
//           title="Sure to remove?"
//           onConfirm={() => remove(record.key)}
//         >
//           <a style={{ color: "red" }}>Remove</a>
//         </Popconfirm>
//       ),
//     },
//   ];

//   return (
//     <Table columns={columns} dataSource={teamMembers} bordered size="small" />
//   );
// };

// export default TableUserComponent;
