import React from "react";
import emailverify from "../assets/images/emailVerification.png"

export default function EmailVerification() {

  return (
    <div>
      <div className='bg-white mx-auto my-10 shadow-2xl rounded-md w-[600px] h-[550px] py-10'>
        <p className='text-center text-lg font-semibold'>Verify your Email Address</p>
        <img src={emailverify} alt="" className='h-[400px] w-96 m-auto' />
        <p className='w-[350px] m-auto'> Before proceeding Our Secret Manager, please check your email for a verification</p>
      </div>
    </div>

  );
}