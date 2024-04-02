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

export default function SecretStoreForm({ closeStoreTab, setCloseStoreTab,getAllSecretsForUsers }) {
  const [apiPairs, setApiPairs] = useState([{ apiKey: "", apiValue: "" }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState(null);

  // const [encryptedData, setEncryptedData] = useState('');
  // const [decryptedData, setDecryptedData] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiValue, setShowApiValue] = useState(
    apiPairs && apiPairs.length > 0 ? Array(apiPairs.length).fill(false) : []
  );

  const [formData, setFormData] = useState({
    title: "",
    userName: "",
    description: "",
    password: "",
    file: null,
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

  //   const encryptApiPairs = (valuesAndKeys) => {
  //     try {
  //       const secretKey = process.env.REACT_APP_SECRET_KEY;
  //       const jsonString = JSON.stringify(valuesAndKeys);
  //       const valuesKeys = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
  //       return valuesKeys;
  //     } catch (err) {
  //       console.log(err, "Error encrypting API pairs");
  //     }
  //   };
  // -----Decrypting Api pairs---
  // const decryptApiPairs = (valuesAndKeys) => {
  //     try {
  //         const secretKey = process.env.REACT_APP_SECRET_KEY;
  //         const bytes = CryptoJS.AES.decrypt(valuesAndKeys, secretKey);
  //         const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  //         return decryptedData;
  //     } catch (err) {
  //         console.log(err, "Error decrypting API pairs");
  //     }
  // }

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
      // You can perform additional checks here if needed
      setSelectedFile(URL.createObjectURL(file));
      setFile(file);
    }
  };

  //   const handleApiPair = () => {
  //     setApiPairs([...apiPairs, { apiKey: "", apiValue: "" }]);
  //   };

  //   const handleMultipleInputs = (value, index, field) => {
  //     const newApiKeyValue = [...apiPairs];
  //     newApiKeyValue[index][field] = value;
  //     setApiPairs(newApiKeyValue);
  //   };

  //   const handleDeleteClick = (index) => {
  //     setApiPairs((prevPairs) => prevPairs.filter((pair, i) => i !== index));
  //   };

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
    setApiPairs([{}]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPassword = formData.password.trim() !== "";
    // const isAnyApiPair = apiPairs.some(
    //   (pair) => pair.apiKey.trim() !== "" && pair.apiValue.trim() !== ""
    // );
    try {
      if (!isPassword) {
        toast.error("Need to be store atleast one secret");
      }
      const secretData = encryptPassword(formData.password);
      const { password, ...rest } = formData;
      const formDetails = { ...rest, secretData };

      const formDataToUpload = new FormData();
      formDataToUpload.append("file", file);
      formDataToUpload.append("secretData", secretData);
      formDataToUpload.append("title", formData.title);
      formDataToUpload.append("username", formData.userName);

      console.log(formDataToUpload, "ll");

      axiosClient
        .post("/api/secrets/secret-encryption", formDataToUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          navigate("/secrets");
          setCloseStoreTab(false);
          getAllSecretsForUsers()
          toast.success(data.Success);
        })
        .catch((err) => {
          // debugger;
          const response = err.response;
          if (response && response?.status === 409) {
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);

            error[keys] = value;
          } else {
            console.error("Error:", response?.status);
          }
        });
    } catch (err) {
      if (!isPassword) {
        toast.error("Need to be store atleast one secret");
      }
    }
  };
  return (
    <div>
      {/* <Header /> */}
      {closeStoreTab && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 w-[100%]">
          <div className="flex justify-center items-center mt-[10px]">
            <div className="border bg-white px-6 py-2 shadow-inner rounded-md">
              <div className="flex justify-between">
                <h1 className="text-[24px] pb-[6px]">Store Secrets</h1>
                <p onClick={handleClick} className="cursor-pointer">
                  <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                </p>
              </div>
              <form className="h-[480px] w-[100%]" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    className="pl-[5px] py-2 border rounded-md"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    name="userName"
                    className="pl-[5px] py-2 border rounded-md"
                    value={formData.userName}
                    onChange={handleChange}
                  />
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
                {/* <div className="flex flex-col py-3 gap-3">
                                    {apiPairs.map((pair, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <label>Api Key</label>
                                            <input type="text" placeholder="API Key" name='apiKey' value={pair.apiKey} className="pl-[5px] py-2 border rounded-md" onChange={(e) => handleMultipleInputs(e.target.value, index, 'apiKey')} />
                                            <label>Api Value</label>
                                            <div className='relative'>
                                                <input type={showApiValue[index] ? "text" : "password"} placeholder="API Value" name='apiValue' value={pair.apiValue} className="pl-[5px] py-2 border rounded-md" onChange={(e) => handleMultipleInputs(e.target.value, index, 'apiValue')} />
                                                <FontAwesomeIcon icon={showApiValue[index] ? faEyeSlash : faEye} onClick={() => handleEyeIcon(index, "apiValue")} className='absolute right-3 top-4 cursor-pointer' />
                                            </div>
                                            <button onClick={(e) => { e.preventDefault(); handleDeleteClick(index) }} className='bg-red-500 py-2 px-3 rounded-md text-white'>Delete</button>
                                            {index === apiPairs.length - 1 && (
                                                <div className="flex items-center gap-3">
                                                    <p className='bg-green-500 py-2 px-3 rounded-md text-white' onClick={handleApiPair}>
                                                        Add<FontAwesomeIcon className="" icon={faPlus} />
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div> */}
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
