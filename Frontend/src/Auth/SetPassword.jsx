import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Crypto from 'crypto-js'
// import axiosClient from "../axios-client";

export default function SetPassword() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [success,setSuccess] = useState('');

    const handleInputChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        // Clear error when user starts typing again
        if (error) {
            setError('');
        }
    }

    const encryptPassword = (encryptData) => {
        // console.log(encryptData,"encrypt-----")
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const securePassword = Crypto.AES.encrypt(encryptData, secretKey).toString();
        return securePassword
    }

    const decryptPassword = (decryptData)=>{
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const checkPassword = Crypto.AES.decrypt(decryptData,secretKey);
        const decrypt = checkPassword.toString(Crypto.enc.Utf8)
        return decrypt
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation checks
        if (!password.trim()) {
            setError("Please set a strong password");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase character");
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase character");
            return;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            setError("Password must contain at least one special character");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("Password must contain a number");
        }

        if (password.length < 8) {
            setError("Length of the passsword atleast 8");
            return;
        }
        try {
            const encryptedPassword = encryptPassword(password)
            console.log(encryptedPassword, "hello")

            const decryptedPassword = decryptPassword(encryptedPassword)
            console.log(decryptedPassword,"decryt")
            // axiosClient.post('', { encryptPassword })
            //     .then(({ res }) => {
            //         console.log(res)
            //         setError('');
            //         setPassword('')
            //     })
            //     .catch((error) => {
            //         console.log(error)
            //     })
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <div>
                <div className='border border-solid rounded-md w-[75%] h-[350px] mx-auto py-[40px] mt-[130px] shadow-xl'>
                    <div className='py-5'>
                        <p className='text-3xl text-center'>Welcome to Secret Manager!</p>
                        <p className='text-xl text-center py-3'>Please create a strong password to maintain secrets securely</p>
                    </div>
                    <div>
                        <form className='flex justify-center gap-3 py-3' onSubmit={handleSubmit}>

                            <input
                                placeholder='Set strong password'
                                className='py-3 w-[40%] border px-3 text-xl'
                                value={password}
                                onChange={handleInputChange} />

                            <button className='border py-3 px-5 rounded-md bg-red-500 text-xl'>Submit</button>

                        </form>
                        {error && <p className='text-red-500 text-center text-xl'>{error}</p>}
                        {/* {success && <p className='text-green-500 text-center'>{success}</p>} */}
                    </div>
                </div>
            </div>
        </>
    )
}
