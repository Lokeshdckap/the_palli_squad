// import React, { useState } from 'react';
// import { useForm } from "react-hook-form"
// // import AuthError from '../AccessRequest';

// export default function Login({ authError, setAuthError, handleAuthError }) {
//     console.log(authError)
//     // const handleAuthError = () => {
//     //     setAuthError(!authError)
//     // }
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm()
//     const handleLogin = (loginCreadentails) => {
//         console.log(loginCreadentails);
//     }
//     return (
//         <>
//             <h2 className='text-center'>Login</h2>
//             <form onSubmit={handleSubmit(handleLogin)}>
//                 <div className='border text-center flex'>
//                     <div className='' onClick={handleAuthError}>
//                         <p>Email</p>
//                         <p>Password</p>
//                     </div>
//                     <div>
//                         <input
//                             type="password"
//                             {...register("password", {
//                                 required: "Password not matched",
//                             })}
//                             className='border border-black rounded-md h-auto p-2 m-2'
//                         />
//                         {errors.password && <p>{errors.password.message}</p>}
//                     </div>
//                     <div>
//                         <input  {...register("email", { required: true, pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })} className='border border-black rounded-md h-auto p-2 m-2' />
//                         {errors.email && errors.email.type === "required" && <p>This field is required</p>}
//                         {errors.email && errors.email.type === "pattern" && <p>Invalid email address</p>}
//                     </div>
//                 </div>
//                 <button type='submit' className='bg-blue-400 w-28 p-2 rounded-md'>Login</button>

//             </form>
//         </>
//     )
// }

import React, { useState } from 'react'
import SuperAdminAccess from '../SuperAdminAccess';

export default function Login() {
    const [loginForm, setLoginForm] = useState({
        password: "",
        email: "",
    });
    const [loginError, setLoginError] = useState({
        password: "",
        email: "",
    });
    const validateLoginForm = () => {
        let newErrors = { ...loginError };
        let isVaild = true;
        if (loginForm.password.trim() === "") {
            newErrors.password = 'password is required';
            isVaild = false;
        }
        if (loginForm.email.trim() === "") {
            newErrors.email = 'Email is required';
            isVaild = false;
        }
        setLoginError(newErrors);
        return isVaild;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value,
        });
        delete loginError[name]
    };
    // const handleLoginCustomer = async (e) => {
    //     e.preventDefault();
    //     if (validateLoginForm()) {
    //         console.log("success");
    //         try {
    //             const { data, errors } = await customerLogin({ variables: { loginInput: loginForm } });
    //             const { token } = data.customerLogin;
    //             const { name, customerId } = Jwt.decode(token)
    //             dispatch(customerLoginData({ name, customerId, token }));
    //             toast.success("User successfully logged", {
    //                 position: 'top-center',
    //                 autoClose: 3000,
    //             })
    //             router.push('/customerHome')
    //         }
    //         catch (error) {
    //             toast.error(error.message, {
    //                 position: 'top-right',
    //                 autoClose: 3000,
    //             })
    //             console.error(error.message);
    //         }
    //     }
    //     else {
    //         router.push('/customerLogin')
    //     }
    // }
    const [authError,setAuthError] = useState(false)
    return (
        < div >
            <div className='flex justify-center items-center border shadow-lg border-solid border-violet-300 my-10 bg-blue-100 w-auto h-auto py-14 mx-80 rounded-md'>
                <form>
                    <div className='grid justify-center gap-3'>
                        <div className='grid justify-center items-center gap-2'>
                            <h2 className='text-indigo-400 text-3xl font-normal'>Login Form</h2>
                        </div>
                        <div className='grid justify-start items-center gap-1'>
                            <label className='text-violet-400'>Email</label>
                            <input onFocus={()=>setAuthError(true)} onBlur={()=>setAuthError(false)} placeholder='Enter the name' onChange={handleChange}  value={loginForm.email} name='email' className='border border-solid border-gray-400 h-10 w-72 pl-3 rounded-md hover:border-violet-400 focus:border-violet-400 outline-none text-gray-500' />
                            {loginError.email && <span className="text-red-400">{loginError.email}</span>}
                            {authError ? <SuperAdminAccess/> : ""}
                        </div>
                        <div className='grid justify-start items-center gap-1'>
                            <label className='text-violet-400'>Password</label>
                            <input placeholder='Enter the password' onChange={handleChange} value={loginForm.password} name='password' type='password' className='border border-solid border-gray-400 h-10 w-72 pl-3 rounded-md hover:border-violet-400 focus:border-violet-400 outline-none text-gray-500' />
                            {loginError.password && <span className="text-red-400">{loginError.password}</span>}
                        </div>
                        <div className='flex gap-3 justify-start items-center pt-3'>
                            <button type='submit' className='border border-solid h-10 w-24 border-violet-400 hover:bg-violet-400 hover:text-white text-violet-400 flex justify-center items-center rounded-md'>Login</button>
                            <div>
                                <span className='text-gray-500'>Don't have any account ?</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    )
}
