import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import CryptoJS from 'crypto-js';

export default function StoreSecrets() {
    const [apiPairs, setApiPairs] = useState([{ apiKey: '', apiValue: '' }])
    const [fileContent,setFileContent] = useState('');
    const [encryptionContent,setEncryptionContent] = useState('')
    const [formData, setFormData] = useState({
        title: "",
        userName: "",
        description: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    // FileEncryption----
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        console.log(file,"---")
        reader.onload = (event) =>{
            const content = event.target.result;
            setFileContent(content)
        }
        reader.readAsText(file)
    }
    const encryptFileContent =()=>{
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const encryptedData = CryptoJS.AES.encrypt(fileContent,secretKey).toString();
        setEncryptionContent(encryptedData)
    }

    // console.log(fileContent,"----fileCntent")
    // console.log(encryptionContent,"encryption Content")

    const encryptPassword = (storePassword) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const passwordEncrypt = CryptoJS.AES.encrypt(storePassword, secretKey).toString();
        return passwordEncrypt;
    }
    const encryptApiPairs = (valuesAndKeys) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const jsonString = JSON.stringify(valuesAndKeys);
        // console.log(jsonString,"jsonString")
        const valuesKeys = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
        return valuesKeys;
    }

    // decryptionLogic for Apikey and ApiValues-------------------------------
    const decryptApiPairs = (valuesAndKeys) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const bytes = CryptoJS.AES.decrypt(valuesAndKeys, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        // console.log(decryptedData,"-------")
        return decryptedData;
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const encryptStorePassword = encryptPassword(formData.password)
            const apikeysAndValues = encryptApiPairs(apiPairs)
            const decryptPassword = decryptApiPairs(apikeysAndValues)
            const { password, ...rest } = formData;
            const formDetails = rest
            
            const storeSecrets = [formDetails, encryptStorePassword, apikeysAndValues]
            // console.log(storeSecrets, "formDtat-----")
            console.log(apikeysAndValues,"apikeysAndValues---") 
            console.log(decryptPassword,"----------decryptPassword")
            // console.log(encryptStorePassword,"encryptStorePassword---")
        } catch (err) {
            console.log(err, "Password not encrypted")
        }
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
        // setShowPassword(prevState => !prevState)
        setShowPassword(!showPassword)
    }

    return (
        <div className="flex justify-center items-center h-screen pt-16">
            <div className="w-[85%] border bg-white px-6 py-4">
                <div className="text-center text-3xl">
                    <h1>Store Secrets</h1>
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
                    <div>
                        <input type='file' onChange={handleFileChange}/>
                        <button onClick={encryptFileContent}>Encrypt File</button>
                    </div>
                    <div className='text-center'>
                        <button type="submit" className='bg-red-500 px-6 py-2 rounded-md'>Submit</button>
                        {encryptionContent&& <textarea value={encryptionContent} readOnly/>}
                    </div>
                </form>
            </div>
        </div>
    );
}
