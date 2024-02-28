import React, { useState } from 'react';
import unAuthDevice from "../assets/images/unAuthDevice.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Angry from './Emojis/Angry'

export default function UnAuthDevice() {
    const [formData, setFormData] = useState({
        email: '',
        description: ''
    });
    const [errMessage, setErrMessage] = useState({
        email: '',
        description: ''
    });
    const [formVisible, setFormVisible] = useState(false)

    const handleClick = () => {
        setFormVisible(!formVisible)
        setErrMessage('')
        setFormData('')
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrMessage = { ...errMessage }
        if (!formData.email || formData.email.trim() === '') {
            newErrMessage.email = 'Email is required'
        }
        else {
            newErrMessage.email = ''
        }

        if (!formData.description || formData.description.trim() === '') {
            newErrMessage.description = 'Description is required'
        }
        else {
            newErrMessage.description = ''
        }

        if (newErrMessage.email || newErrMessage.description) {
            setErrMessage(newErrMessage);
        } else {
            console.log('Form Data:', formData);
            setFormVisible(!formVisible)
            setFormData({
                email: '',
                description: ''
            });
            setErrMessage({
                email: '',
                description: ''
            });
        }
    }
    return (
        <>
            {formVisible && (<div className='bg-white shadow-2xl grid grid-cols-6 w-[800px] h-[400px] mx-auto mt-[105px] border rounded-md pl-3 pr-3'>
                <div className='col-span-3 justify-end'>
                    <img src={unAuthDevice} className='w-96 h-[390px]' />
                </div>
                <div className='col-span-3'>
                    <h2 className='text-center text-red-500 font-semibold py-5'>UnAuthorize device login<span className='pl-[175px]' onClick={handleClick}><FontAwesomeIcon icon={faTimes} /></span></h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder='Email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='border pl-2 h-10 w-full rounded-md' />
                        {errMessage.email && <p className='text-red-500'><span><Angry /></span>{errMessage.email}</p>}
                        <textarea
                            placeholder='Description'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            className='border pl-2 py-1 w-full h-40 mt-5 rounded-md'>
                        </textarea>
                        {errMessage.description && <p className='text-red-500'><span><Angry /></span>{errMessage.description}</p>}
                        <button type='submit' className='bg-red-500 border h-11 px-7 text-white rounded-md ml-[140px]'>Submit</button>
                    </form>
                </div>
            </div>
            )}
            <div>
                <button type='submit' onClick={handleClick}>Click me</button>
            </div>
        </>
    )
}