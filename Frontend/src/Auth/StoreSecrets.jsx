import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


export default function StoreSecrets() {
    const [apiPairs, setApiPairs] = useState([{ apiKey: '', apiValue: '' }])
    console.log(apiPairs, "apiPairs")

    const handleApiPair = () => {
        setApiPairs([...apiPairs, { apiKey: "", apiValue: "" }])
    }

    const handleMultipleInputs = () => {

    }

    const handleDeleteClick = () => {

    }
    return (
        <>
            <div>
                <div className='w-[75%] border h-[450px]'>
                    <div className='text-center text-3xl'>
                        <h1>Store Secrets</h1>
                    </div>
                    <form className='w-[80px]'>
                        <div className='flex items-center gap-3'>
                            <label>Title</label>
                            <input type="text" placeholder='Title' className='pl-[5px] py-2.5 border rounded-md' />
                        </div>
                        <div className='flex items-center gap-3'>
                            <label>Username</label>
                            <input type="text" placeholder='Username' className='pl-[5px] py-2.5 border rounded-md' />
                        </div>
                        <div className='flex items-center gap-3'>
                            <label>Password</label>
                            <input type="text" placeholder='Password' className='pl-[5px] py-2.5 border rounded-md' />
                        </div>
                        <div className='flex items-center gap-3'>
                            <label>Description</label>
                            <input type="text" placeholder='Description' className='pl-[5px] py-2.5 border rounded-md' />
                        </div>
                        <div className='flex gap-5'>
                            {apiPairs.map((pair, index) => {
                                <div>
                                    <label>Api Key</label>
                                    <input type='text'
                                        placeholder='API Key'
                                        value={pair.apiKey}
                                        onChange={(e) => handleMultipleInputs(e, index)} />

                                    <label>Api Value</label>
                                    <input type='text'
                                        placeholder='API Key'
                                        value={pair.apiKey}
                                        onChange={(e) => handleMultipleInputs(e, index)} />

                                    <button onClick={() => handleDeleteClick(index)}>Delete</button>
                                </div>
                            })}
                            <div className='flex items-center gap-3' >
                                <p className='py-2.5 px-5 border rounded-md' onClick={handleApiPair}><FontAwesomeIcon icon={faPlus} /></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}