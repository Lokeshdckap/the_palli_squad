import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


export default function StoreSecrets() {
    const [apiPairs, setApiPairs] = useState([{ apiKey: '', apiValue: '' }])

    // console.log(apiPairs, "apiPairs")

    const [formData, setFormData] = useState({
        title: "",
        userName: "",
        description: "",
        password:"",
    })
    console.log(formData.password   , "formDAta-----------")
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
        // console.log(value,"value-----");
        // console.log(index,"index-----");
        // console.log(field,'field-----');
        const newApiKeyValue = [...apiPairs];
        newApiKeyValue[index][field] = value
        setApiPairs(newApiKeyValue)
    }

    const handleDeleteClick = (index) => {
        // setApiPairs((prevPairs) => {
        //     const newPairs = [...prevPairs]
        //     newPairs.splice(index, 1)
        //     return newPairs;
        // })
        setApiPairs(prevPairs => prevPairs.filter((pair, i) => i !== index));
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-[85%] border bg-white px-6 py-4">
                <div className="text-center text-3xl">
                    <h1>Store Secrets</h1>
                </div>
                <form className="h-[480px] overflow-y-scroll">
                    <div className="flex flex-col gap-2">
                        <label>Title</label>
                        <input type="text" placeholder="Title" name="title" className="pl-[5px] py-2.5 border rounded-md" value={formData.title} onChange={handleChange} />
                        <label>Username</label>
                        <input type="text" placeholder="Username" name="userName" className="pl-[5px] py-2.5 border rounded-md" value={formData.userName} onChange={handleChange} />
                        <label>Description</label>
                        <textarea type="text" placeholder="Description" name="description" className="pl-[5px] py-2.5 border rounded-md" value={formData.description} onChange={handleChange} />
                        <label>Password</label>
                        <input type='password' placeholder='Secure password' name="password" className="pl-[5px] py-2.5 border rounded-md" value={formData.password} onChange={handleChange}></input>
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
                </form>
            </div>
        </div>
    );

}