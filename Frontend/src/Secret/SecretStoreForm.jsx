import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';
import CryptoJS from "crypto-js";
import Password from 'antd/es/input/Password';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../axios-client';
import { useNavigate } from 'react-router-dom';

export default function SecretStoreForm({ closeStoreTab, setCloseStoreTab }) {

    const [apiPairs, setApiPairs] = useState([{ apiKey: '', apiValue: '' }])
    const [selectedFile, setSelectedFile] = useState(null);
    const [encryptedData, setEncryptedData] = useState('');
    const [decryptedData, setDecryptedData] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        userName: "",
        description: "",
        password: "",
    })
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file)
    }

    const encryptFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const secretKey = process.env.REACT_APP_SECRET_KEY
            reader.onload = () => {
                const encryptedData = CryptoJS.AES.encrypt(reader.result, secretKey).toString();
                resolve(encryptedData)
            }
            reader.onerror = (error) => reject(error)
            reader.readAsDataURL(file);
        })
    }
    const decryptFile = (encryptedData) => {
        return new Promise((resolve, reject) => {
            try {
                const secretKey = process.env.REACT_APP_SECRET_KEY;
                const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
                resolve(decryptedData);
            } catch (error) {
                reject(error);
            }
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const isPassword = formData.password.trim() !== "";
        const isAnyApiPair = apiPairs.some(pair => pair.apiKey.trim() !== "" && pair.apiValue.trim() !== "");
        try {
            const encryptStorePassword = encryptPassword(formData.password)
            const apikeysAndValues = encryptApiPairs(apiPairs)
            const { password, ...rest } = formData;
            const formDetails = rest
            const storeSecrets = [formDetails, encryptStorePassword, apikeysAndValues]

            const response = await axiosClient.post('', storeSecrets);
            console.log(response);
            // navigate("/emailverify");
            setCloseStoreTab(false)
            toast.success("Successfully stored")

        }
        catch (err) {
            if (!isPassword && !isAnyApiPair) {
                toast.error('Need to be store atleast one secret')
            }
        }

    };

    const handleDecryption = async () => {
        try {
            if (!encryptedData) {
                alert('No encrypted data available.');
                return;
            }

            const decryptedData = await decryptFile(encryptedData);
            setDecryptedData(decryptedData);
        } catch (error) {
            console.error('Decryption error:', error);
        }
    };

    const encryptPassword = (storePassword) => {
        try {
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            const passwordEncrypt = CryptoJS.AES.encrypt(storePassword, secretKey).toString();
            return passwordEncrypt;
        } catch (err) {
            console.log(err, "Error encrypting password");
        }
    }

    const encryptApiPairs = (valuesAndKeys) => {
        try {
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            const jsonString = JSON.stringify(valuesAndKeys);
            const valuesKeys = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
            return valuesKeys;
        } catch (err) {
            console.log(err, "Error encrypting API pairs");
        }
    }

    const decryptApiPairs = (valuesAndKeys) => {
        try {
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            const bytes = CryptoJS.AES.decrypt(valuesAndKeys, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            return decryptedData;
        } catch (err) {
            console.log(err, "Error decrypting API pairs");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleApiPair = () => {
        setApiPairs([...apiPairs, { apiKey: "", apiValue: "" }])
    }

    const handleMultipleInputs = (value, index, field) => {
        const newApiKeyValue = [...apiPairs];
        newApiKeyValue[index][field] = value
        setApiPairs(newApiKeyValue)
    }

    const handleDeleteClick = (index) => {
        setApiPairs(prevPairs => prevPairs.filter((pair, i) => i !== index));
    }

    const handleEyeIcon = () => {
        setShowPassword(!showPassword)
    }

    const handleClick = () => {
        setCloseStoreTab(false)
        setFormData("")
    }
    // console.log(closeStoreTab, "closeStoreTab")
    return (
        <div>
            {/* <Header /> */}
            {closeStoreTab && (
                <div className="flex justify-center items-center mt-[10px]">
                    <div className="w-[85%] border bg-white px-6 py-2 shadow-inner rounded-md">
                        <div className="flex justify-between">
                            <h1 className="text-[24px] pb-[6px]">Store Secrets</h1>
                            <p onClick={handleClick} className="cursor-pointer"><FontAwesomeIcon icon={faTimes} className="h-6 w-6" /></p>
                        </div>
                        <form className="h-[480px] overflow-y-scroll" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label>Title</label>
                                <input type="text" placeholder="Title" name="title" className="pl-[5px] py-2.5 border rounded-md" value={formData.title} onChange={handleChange} />
                                <label>Username</label>
                                <input type="text" placeholder="Username" name="userName" className="pl-[5px] py-2.5 border rounded-md" value={formData.userName} onChange={handleChange} />
                                <label>Description</label>
                                <textarea type="text" placeholder="Description" name="description" className="pl-[5px] py-2.5 border rounded-md" value={formData.description} onChange={handleChange} />
                                <label>Password</label>
                                <div className='relative'>
                                    <input type={showPassword ? "text" : "password"} placeholder='Secure password' name="password" className="pl-[5px] py-2.5 border rounded-md w-full" value={formData.password} onChange={handleChange}></input>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={handleEyeIcon} className='absolute right-3 top-4 cursor-pointer' />
                                </div>
                            </div>
                            <div className="flex flex-col py-3 gap-3">
                                {apiPairs.map((pair, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <label>Api Key</label>
                                        <input type="text" placeholder="API Key" name='apiKey' value={pair.apiKey} className="pl-[5px] py-2.5 border rounded-md" onChange={(e) => handleMultipleInputs(e.target.value, index, 'apiKey')} />
                                        <label>Api Value</label>
                                        <input type="text" placeholder="API Value" name='apiValue' value={pair.apiValue} className="pl-[5px] py-2.5 border rounded-md" onChange={(e) => handleMultipleInputs(e.target.value, index, 'apiValue')} />
                                        <button onClick={(e) => { e.preventDefault(); handleDeleteClick(index) }} className='bg-red-500 py-2 px-3 rounded-md'>Delete</button>
                                        {index === apiPairs.length - 1 && (
                                            <div className="flex items-center gap-3">
                                                <p className='bg-green-500 py-2 px-3 rounded-md' onClick={handleApiPair}>
                                                    Add<FontAwesomeIcon className="" icon={faPlus} />
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* <input
                                type='file'
                                onChange={handleFileChange}
                            />
                            <button>Encrypt</button> */}

                            <button type='submit'>Submit</button>
                        </form>
                        {/* {encryptedData && (<button onClick={handleDecryption}>DecryptFile</button>)}
                        {decryptedData && (<p>Decrypted Data: {decryptedData}</p>)} */}
                    </div>
                </div>
            )}
        </div>
    );
}