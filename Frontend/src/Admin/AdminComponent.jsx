import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { useParams } from "react-router-dom";
import ExistingUsers from "./ExistingUser.jsx/ExistingUsers";
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

        setExistUserList(res.data.users);
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
        // console.log(res.data.users);
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
