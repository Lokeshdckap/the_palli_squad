import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import Crypto from 'crypto-js';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SecreteCode() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        // Clear error when user starts typing again
        if (error) {
            setError('');
        }
    }

    const encryptPassword = (encryptData) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const securePassword = Crypto.AES.encrypt(encryptData, secretKey).toString();
        return securePassword;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation checks
        if (!password.trim()) {
            setError("Please set a strong password");
            toast.error("Please set a strong password")
            return;
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[^A-Za-z0-9]/.test(password) || !/[0-9]/.test(password)) {
            setError("Password must contain at least one uppercase, one lowercase, one special character, and one number");
            toast.error("Password must contain at least one uppercase, one lowercase, one special character, and one number")
            return;
        }
        if (password.length < 8) {
            setError("Length of the password must be at least 8 characters");
            toast.error("Length of the password must be at least 8 characters")
            return;
        }
        try {
            const encryptedPassword = encryptPassword(password)
            console.log(encryptedPassword, "hello")
            toast.success("Successfully stored secret code")
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
        catch (error) {
            console.log(error);
            toast.error("Storing secret code facing error")
        }
    }

    return (
        <div className='border border-solid rounded-md w-[75%] h-[350px] mx-auto py-[40px] mt-[130px] shadow-xl'>
            <div className='py-5'>
                <p className='text-2xl text-center'>Welcome to Secret Manager!</p>
                <p className='text-xl text-center py-3'>Please create a <span className='text-red-500'>strong password</span> to maintain secrets securely</p>
            </div>
            <div>
                <form className='flex justify-center gap-3 py-3' onSubmit={handleSubmit}>
                    <Input.Password
                        placeholder='Set strong password'
                        className='py-2 w-[40%] px-3 text-xl'
                        value={password}
                        onChange={handleInputChange}
                        iconRender={visible => (visible ? <LockOutlined /> : <LockOutlined />)}
                    />
                    <Button
                        type="primary"
                        htmlType="submit"
                        className='py-[22px] px-5 align-middle bg-red-500'
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        Submit
                    </Button>
                </form>
                {error && <p className='text-red-500 text-center text-xl'>{error}</p>}
            </div>
        </div>
    )
}
