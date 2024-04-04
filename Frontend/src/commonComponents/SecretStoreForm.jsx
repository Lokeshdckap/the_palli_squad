import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faEyeSlash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import Password from "antd/es/input/Password";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";

export default function SecretStoreForm({
  closeStoreTab,
  setCloseStoreTab,
  getAllSecretsForUsers,
  secretForm,
  setSecretForm,
}) {
  const [apiPairs, setApiPairs] = useState([{ apiKey: "", apiValue: "" }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showApiValue, setShowApiValue] = useState(
    apiPairs && apiPairs.length > 0 ? Array(apiPairs.length).fill(false) : []
  );

  const [formData, setFormData] = useState({
    title: "",
    userName: "",
    description: "",
    password: "",
  });
  const navigate = useNavigate();

  const encryptPassword = (storePassword) => {
    try {
      const secretKey = process.env.REACT_APP_SECRET_KEY;
      const passwordEncrypt = CryptoJS.AES.encrypt(
        storePassword,
        secretKey
      ).toString();
      return passwordEncrypt;
    } catch (err) {
      console.log(err, "Error encrypting password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const handleEyeIcon = (index, fieldType) => {
    if (fieldType === "password") {
      setShowPassword(!showPassword);
    } else if (fieldType === "apiValue" && typeof index === "number") {
      setShowApiValue((prevState) => {
        const updatedShowApiValue = [...prevState];
        updatedShowApiValue[index] = !updatedShowApiValue[index];
        return updatedShowApiValue;
      });
    }
  };

  const handleClick = () => {
    setCloseStoreTab(false);
    setFormData("");
  };

  const handleClick1 = () => {
    setSecretForm(false);
    setFormData("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, userName } = formData;
    const validationErrors = {};
    if (!title.trim()) {
      validationErrors.title = "Title is required";
    }
    if (!userName.trim()) {
      validationErrors.userName = "Username is required";
    }

    setError(validationErrors);

    try {
      if (Object.keys(validationErrors).length === 0) {

        const isPassword = formData.password?.trim() !== "";

        if (!isPassword || !file) {
          return toast.error("Need to store at least one secret");
        }

        const secretData = encryptPassword(formData.password);
        const { password, ...rest } = formData;

        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file);
        formDataToUpload.append("secretData", secretData);
        formDataToUpload.append("title", formData.title);
        formDataToUpload.append("username", formData.userName);

        axiosClient
          .post("/api/secrets/secret-encryption", formDataToUpload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => {
            navigate("/secrets");
            setCloseStoreTab(false);
            getAllSecretsForUsers();
            toast.success(data.Success);
          })
          .catch((err) => {
            // debugger;
            const response = err.response;
            if (response && response?.status === 409) {
              let error = {};
              let keys = Object.keys(response.data);
              let value = Object.values(response.data);
              setError(error);
              error[keys] = value;
            } else {
              console.error("Error:", response?.status);
            }
          });
      }
    } catch (err) {
      if (!formData.password?.trim() !== "" || !file) {
        toast.error("An error occurred while submitting the form.");
      }
    }
  };
  return (
    <div>
      {closeStoreTab && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 w-[100%]">
          <div className="flex justify-center items-center mt-[10px]">
            <div className="border bg-white px-6 py-2 shadow-inner rounded-md">
              <div className="flex justify-between">
                <h1 className="text-[20px]">Store Secrets</h1>
                <p onClick={handleClick} className="cursor-pointer">
                  <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                </p>
              </div>
              <form className="h-[500px] w-[100%]" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1 mt-2">
                  <label>
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    className="pl-[5px] py-2 border rounded-md"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {!errors.title ? (
                    <span className="text-base invisible">Required</span>
                  ) : (
                    <span className="text-red-500">{errors.title}</span>
                  )}
                  <label>
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    name="userName"
                    className="pl-[5px] py-2 border rounded-md"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                  {!errors.userName ? (
                    <span className="text-base invisible">Required</span>
                  ) : (
                    <span className="text-red-500">{errors.userName}</span>
                  )}
                  <label>Description</label>
                  <textarea
                    type="text"
                    placeholder="Description"
                    name="description"
                    className="pl-[5px] py-2 border rounded-md"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <label>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Secure password"
                      name="password"
                      className="pl-[5px] py-2 border rounded-md w-full"
                      value={formData.password}
                      onChange={handleChange}
                    ></input>
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      onClick={() => handleEyeIcon(null, "password")}
                      className="absolute right-3 top-4 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <label>Upload File</label>
                  <input type="file" onChange={handleFileChange} />
                </div>
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="bg-red-600 py-2 px-6 rounded-md text-white"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {secretForm && (
         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 w-[100%]">
         <div className="flex justify-center items-center mt-[10px]">
           <div className="border bg-white px-6 py-2 shadow-inner rounded-md">
             <div className="flex justify-between">
               <h1 className="text-[20px]">Store Secrets For This Team</h1>
               <p onClick={handleClick1} className="cursor-pointer">
                 <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
               </p>
             </div>
             <form className="h-[500px] w-[100%]" onSubmit={handleSubmit}>
               <div className="flex flex-col gap-1 mt-2">
                 <label>
                   Title <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="text"
                   placeholder="Title"
                   name="title"
                   className="pl-[5px] py-2 border rounded-md"
                   value={formData.title}
                   onChange={handleChange}
                 />
                 {!errors.title ? (
                   <span className="text-base invisible">Required</span>
                 ) : (
                   <span className="text-red-500">{errors.title}</span>
                 )}
                 <label>
                   Username <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="text"
                   placeholder="Username"
                   name="userName"
                   className="pl-[5px] py-2 border rounded-md"
                   value={formData.userName}
                   onChange={handleChange}
                 />
                 {!errors.userName ? (
                   <span className="text-base invisible">Required</span>
                 ) : (
                   <span className="text-red-500">{errors.userName}</span>
                 )}
                 <label>Description</label>
                 <textarea
                   type="text"
                   placeholder="Description"
                   name="description"
                   className="pl-[5px] py-2 border rounded-md"
                   value={formData.description}
                   onChange={handleChange}
                 />
                 <label>Password</label>
                 <div className="relative">
                   <input
                     type={showPassword ? "text" : "password"}
                     placeholder="Secure password"
                     name="password"
                     className="pl-[5px] py-2 border rounded-md w-full"
                     value={formData.password}
                     onChange={handleChange}
                   ></input>
                   <FontAwesomeIcon
                     icon={showPassword ? faEyeSlash : faEye}
                     onClick={() => handleEyeIcon(null, "password")}
                     className="absolute right-3 top-4 cursor-pointer"
                   />
                 </div>
               </div>
               <div className="flex gap-3 mt-3">
                 <label>Upload File</label>
                 <input type="file" onChange={handleFileChange} />
               </div>
               <div className="text-center mt-4">
                 <button
                   type="submit"
                   className="bg-red-600 py-2 px-6 rounded-md text-white"
                 >
                   Submit
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
      )}
    </div>
  );
}
