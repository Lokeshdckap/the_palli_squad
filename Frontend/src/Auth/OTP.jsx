import React, { useState } from 'react';
import otp from '../assets/images/OTP.png';
import Login from './Login/login';
import Smiley from './Emojis/Smiley';

export default function OTP() {
    const [adminAccess, setAdminAccess] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [otpValue, setOtpValue] = useState('');

    // ----------------Handling form visibilty an hidden-------------------------------------
    const handleButton = () => {
        setAdminAccess(!adminAccess);
        setOtpValue('')
    }
    const handleClickInside = (e) => {
        e.stopPropagation();
    };

    const handleCloseComponent = () => {
        setAdminAccess(false);
        setOtpValue('');
    };

    //------------------Handling form validation------------------------------------------------ 
    const handleAdminAccess = (e) => {
        e.preventDefault()
        if (!otpValue.trim()) {
            setErrMessage("Enter the OTP")
        }

    };
    console.log(otpValue,"---")
    const handleOtpValue = (e) => {
        setOtpValue(e.target.value);
        setErrMessage('');
    }
    return (
        <>
            {adminAccess && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50" onClick={handleCloseComponent}>
                    <div className="bg-white shadow-2xl rounded-md w-[380px] h-[450px] py-5 px-5" onClick={handleClickInside}>
                        <h2 className="text-center font-semibold">Please Enter the <span className='text-red-500'>OTP</span></h2>
                        <img src={otp} className="m-auto w-96 h-80 py-5" alt="Super Admin" />
                        <div>
                            <form onSubmit={handleAdminAccess}>
                                <input
                                    placeholder='OTP here'
                                    className='border border-black py-2 px-2 rounded-md'
                                    value={otpValue}
                                    onChange={handleOtpValue}
                                />
                                <button type='submit' className='bg-red-500 border h-11 px-2 text-white rounded-md ml-1'>Submit</button>
                            </form>
                        </div>
                        {errMessage && <p className='text-red-500'><span><Smiley /></span>
                            {errMessage}</p>}
                    </div>
                </div>
            )}
            <div>
                <button onClick={handleButton}>Click me</button>
            </div>
        </>
    );
}
