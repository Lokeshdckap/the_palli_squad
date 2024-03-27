import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../src/commonComponents/Button";
import { useForm } from "react-hook-form";
import superAdmin from "../assets/images/adminAccess.png";
import image from "../assets/images/OTP.png";
<<<<<<< HEAD
=======
import { useStateContext } from "../context/ContextProvider";
import HashLoader from "react-spinners/HashLoader";
>>>>>>> 17055d636bdb2ce22145c3b1c0a208a30c9b27c7

import axiosClient from "../axios-client";

import OtpInput from 'react-otp-input';

const Signin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [adminAccess, setAdminAccess] = useState(false);
  const [otps, setOtps] = useState(true);

  const [otp, setOtp] = useState("");

  const [errMessage, setErrMessage] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------Handling form visibilty an hidden-------------------------------------
  const handleButton = () => {
    setAdminAccess(!adminAccess);
    setOtpValue("");
  };
  const handleClickInside = (e) => {
    e.stopPropagation();
  };

  const handleCloseComponent = () => {
    setAdminAccess(false);
    setOtpValue("");
  };

  const handleSignin = (data) => {
<<<<<<< HEAD
    console.log(data);

    axiosClient
      .post("/api/auth/login", data)
      .then((res) => {
        console.log(res);
        setOtp(true);
=======
    setLoading(true);
    axiosClient
      .post("/api/auth/login", data)
      .then((res) => {
        setOtps(true);
        setLoading(false);
>>>>>>> 17055d636bdb2ce22145c3b1c0a208a30c9b27c7
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 401) {
          // showToastMessage(response.data);
          // openNotificationWithIcon('success')
          setAdminAccess(true);
          setLoading(false);
        } else {
          console.error("Error:", response?.status);
        }
      });
  };

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    console.log("Entered OTP:", otp);
=======
    let payload = {
      otp: otp,
    };
    axiosClient
      .post("/api/auth/verify-otp", payload)
      .then((res) => {
        setAuth({
          token: res.data.access,
        });
        setOtps(false);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 401) {
          // showToastMessage(response.data);
          // openNotificationWithIcon('success')
          setAdminAccess(true);
        } else {
          console.error("Error:", response?.status);
        }
      });
>>>>>>> 17055d636bdb2ce22145c3b1c0a208a30c9b27c7
  };

  // const MyButton = () => {
  //   const [isClicked, setIsClicked] = useState(false);
  
  //   const handleClick = () => {
  //     setIsClicked(!isClicked);
  //   };

  return (
    <div>
      <div>
        <div>
          <section class="bg-gray-50 dark:bg-gray-900">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login into your account
                  </h1>
                  <form
                    class="space-y-4 md:space-y-6"
                    onSubmit={handleSubmit(handleSignin)}
                  >
                    <div>
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        type="text"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required=""
                        {...register("email", {
                          required: "Email is required",
                          // pattern: {
                          //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          //   message: "Invalid email address",
                          // },
                        })}
                      />
                      {errors.email && (
                        <span className="text-red-500 text-sm">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        // type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required=""
                        {...register("password", {
                          required: "Password is required",
                          // minLength: {
                          //   value: 8,
                          //   message: "Password must be at least 8 characters",
                          // },
                          // pattern: {
                          //   value:
                          //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                          //   message:
                          //     "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character",
                          // },
                        })}
                      />

                      {errors.password && (
                        <span className="text-red-500 text-sm">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                    <>
                      <Button givenName={"Signin"} type="submit" />
                    </>
                  </form>{" "}
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to={"/signup"}
                      class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Signup here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {adminAccess && (
          <div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
            // onClick={handleCloseComponent}
          >
            <div
              className="bg-white shadow-2xl rounded-md w-[350px] h-[450px] py-5 px-5"
              // onClick={handleClickInside}
            >
              <h2 className="text-center font-semibold text-red-500">
                Auth Error
              </h2>
              <img
                src={superAdmin}
                className="m-auto w-96 h-80 py-5"
                alt="Super Admin"
              />
              <p className="text-center">
                Please wait{" "}
                <span className="font-medium text-red-500">super admin</span>{" "}
                needs to verify your registration
              </p>
            </div>
          </div>
        )}
        {otps && (
          <div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
            onClick={handleCloseComponent}
          >
            <div
              className="bg-white shadow-2xl rounded-md w-[380px] h-[450px] py-5 px-5"
              onClick={handleClickInside}
            >
              <h2 className="text-center font-semibold">
                Please Enter the <span className="text-red-500">OTP</span>
              </h2>
              <img
                src={image}
                className="m-auto w-96 h-80 py-5"
                alt="Super Admin"
              />
              <div className="flex justify-center">
                <form onSubmit={handleFormSubmit} className="w-72 flex justify-between">
                  <div className="flex space-x-10">
                    <OtpInput
                      value={otp}
                      // onChange={setOtp}
                      onChange={handleOtpChange}
                      numInputs={4}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => { 
                        return <input class="otp" {...props} />;
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 h-10 px-2 text-white rounded-md"
                  >
                    Submit
                  </button>
                </form>
              </div>
              {/* {errMessage && (
                <p className="text-red-500">
                  <span>
                    <Smiley />
                  </span>
                  {errMessage}
                </p>
              )} */}
            </div>
          </div>
        )}
        {loading && (
            <>
              <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
              <div className="">
                <p className="absolute top-[48%] left-[48%] z-50 ">
                  <HashLoader color="#3197e8" />
                </p>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default Signin;