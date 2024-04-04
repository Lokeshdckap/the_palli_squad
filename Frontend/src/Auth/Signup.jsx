import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Button, notification, Popover, Space } from 'antd';

import { useForm } from "react-hook-form";

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import GetPasswordPopover from "../../src/commonComponents/GetPasswordPopover";
import axiosClient from "../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HashLoader from "react-spinners/HashLoader";


const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setCofirmPassword] = useState(false);

  const [inviteDetail, setInviteDetail] = useState(JSON.parse(localStorage.getItem('inviteInfo')))

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSignup = (data) => {

    setLoading(true);

   const signupData = inviteDetail
      ? { ...data, team_uuid: inviteDetail.team_uuid, role: inviteDetail.role }
      : { ...data };

    axiosClient
      .post("/api/auth/register", signupData)
      .then((res) => {
        console.log(res);
        navigate("/emailverify");
        setLoading(false);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 400) {;
          setLoading(false);
        } else {
          console.error("Error:", response?.status);
        }
      });
  };

  
  return (
    <div>
      <div>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="space-y-0.5 md:space-y-4 sm:p-5 ">
                <h2 className="text-xl mb-1  font-bold leading-tight tracking-tight  md:text-2xl dark:text-white">
                  Create an account
                </h2>
                <form
                  className="space-y-4 md:space-y-4"
                  onSubmit={handleSubmit(handleSignup)}
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Username
                    </label>
                    <input
                      type="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="username"
                      required=""
                      {...register("username", { required: true })}
                    />
                    {errors.username && (
                      <span className="text-red-500 text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
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
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Invalid email address",
                        },
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
                      htmlFor="password"
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Popover
                      open={watch("password") ? true : false}
                      content={
                        <>
                          <GetPasswordPopover password={watch("password")} />
                        </>
                      }
                      placement="right"
                    >
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="password"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required=""
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                              message:
                                "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character",
                            },
                          })}
                        />
                        <p
                          className="absolute top-2 right-2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                          id="eye"
                        >
                          {showPassword ? (
                            <EyeOutlined
                              style={{ fontSize: "16px", color: "#595959" }}
                            />
                          ) : (
                            <EyeInvisibleOutlined
                              style={{ fontSize: "16px", color: "#595959" }}
                            />
                          )}
                        </p>
                        {errors.password && (
                          <span className="text-red-500 text-sm">
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                    </Popover>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        placeholder="confirm-password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required=""
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === watch("password", "") ||
                            "Passwords do not match",
                        })}
                      />
                      <p
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={() => setCofirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOutlined
                            style={{ fontSize: "16px", color: "#595959" }}
                          />
                        ) : (
                          <EyeInvisibleOutlined
                            style={{ fontSize: "16px", color: "#595959" }}
                          />
                        )}
                      </p>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>

                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className=" text-gray-900 bg-white border border-gray-300 pt-2 focus:outline-none hover:bg-gray-700  w-[100rem] font-medium rounded-lg text-sm px-5 py-2  dark:bg-gray-800 dark:text-white dark:border-gray-600 "
                  >
                    create an account
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                    Already have an account?{" "}
                    <Link
                      to={"/signin"}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Login here
                    </Link>
                  </p>
                  {/* <Button onClick={() => openNotificationWithIcon('success')}>Success</Button> */}

                </form>
              </div>
            </div>
          </div>
        </section>
        <ToastContainer />

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

export default Signup;
