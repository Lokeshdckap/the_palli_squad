import React, { useState } from "react";
import { Button, Modal } from "antd";
import axiosClient from "../axios-client";

const SetPassword = ({
  isModalOpen,
  handleCancel,
  handleOk,
  setIsModalOpen,
  setPassword,
  password,
  handleInputChange,
  handleSubmit,
  error,
  setError
}) => {
 
  
  return (
    <>
      <Modal
        title="Passphrase"
        open={isModalOpen}
        footer={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div className="py-5">
            <p className="text-xl text-center py-3">
              Please Enter Your Passphrase
            </p>
          </div>
          <div>
            <form
              className="flex justify-center gap-1 py-1"
              onSubmit={handleSubmit}
            >
              <input
                type="password"
                placeholder="Enter Your Passphrase"
                className="py-1 w-[100%] border px-1 text-md"
                value={password}
                onChange={handleInputChange}
              />
              <button className="border py-3 px-5 rounded-md bg-red-500 text-xl">
                Submit
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-center text-lg">{error}</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SetPassword;
