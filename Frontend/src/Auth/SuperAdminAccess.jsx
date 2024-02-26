import React, { useState } from 'react';
import superAdmin from '../assets/images/adminAccess.png';

export default function SuperAdminAccess() {
    const [adminAccess, setAdminAccess] = useState(false);

    const handleAdminAccess = () => {
        setAdminAccess(!adminAccess);
    };

    const handleClickInside = (e) => {
        e.stopPropagation();
    };

    const handleCloseComponent = () => {
        setAdminAccess(false);
    };

    return (
        <>
            {adminAccess && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50" onClick={handleCloseComponent}>
                    <div className="bg-white shadow-2xl rounded-md w-[350px] h-[450px] py-5 px-5" onClick={handleClickInside}>
                        <h2 className="text-center font-semibold text-red-500">Auth Error</h2>
                        <img src={superAdmin} className="m-auto w-96 h-80 py-5" alt="Super Admin" />
                        <p className="text-center">
                            Please wait <span className="font-medium text-red-500">super admin</span> needs to verify your registration
                        </p>
                    </div>
                </div>
            )}
            <div>
                <button onClick={handleAdminAccess}>Click me</button>
            </div>
        </>
    );
}
