// import React, { Component } from 'react';

// export default function LoginInputs({ type, value, onChange, placeholder, isRequired, errorMessgae }) {
//     const handleChange = (e) => {
//         onChange(e.target.value)
//     }
//     return (
//         <>
//             <div>
//                 <input
//                     type={type}
//                     value={value}
//                     onChange={handleChange}
//                     placeholder={placeholder}
//                     required={isRequired}
//                 />
//                 {isRequired && value === '' && <span style={{color:'red'}}>{errorMessgae}</span>}
//             </div>
//         </>
//     )
// }