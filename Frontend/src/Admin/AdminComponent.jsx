import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { useParams } from "react-router-dom";
import { ExistingUsers } from "./ExistingUser.jsx/ExistingUsers";
import { PendingAuthUser } from "./PendingAuthUsers/PendingAuthUser";
import axiosClient from "../axios-client";
import { useMyContext } from "../context/AppContext";
export const AdminComponent = () => {
  const param = useParams();

  const [existUserList, setExistUserList] = useState([]);
  const [approvalSignup, setApprovalSignup] = useState([]);
  const [approvalDevice, setApprovalDevice] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/api/superAdmin/getAllUsers")

      .then((res) => {
        console.log(res.data);
        // const algorithm = "aes-256-cbc";
        // const key = crypto.randomBytes(32); // Use the same key generated on the server
        // const iv = Buffer.from(res.data.iv, "hex");

        // const decipher = crypto.createDecipheriv(algorithm, key, iv);
        // let decryptedData = decipher.update(
        //   res.data.encryptedData,
        //   "hex",
        //   "utf-8"
        // );
        // decryptedData += decipher.final("utf-8");

        // console.log(decryptedData);

        // setExistUserList(decodedData.users);
      })
      .catch((err) => {
        console.log(err);
      });
    approvalForNewSignups();
    approvalForDevice();
  }, []);

  const approvalForNewSignups = () => {
    axiosClient
      .get("/api/superAdmin/approveWaitingForNewSignups")
      .then((res) => {
        console.log(res.data.users);
        setApprovalSignup(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approvalForDevice = () => {
    axiosClient
      .get("/api/superAdmin/approvalWaitingUnAuthorizedDeviceLogin")
      .then((res) => {
        console.log(res);
        setApprovalDevice(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Header param={param} />
      <div>
        {window.location.pathname == "/admin/existingUsers" ? (
          <ExistingUsers existUserList={existUserList} />
        ) : (
          <PendingAuthUser
            approvalSignup={approvalSignup}
            approvalDevice={approvalDevice}
          />
        )}
      </div>
    </div>
  );
};
