import React, { useEffect } from "react";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import { useMyContext } from "../context/AppContext";
import SecreteCode from "../Auth/Login/SecretCode";
import { Modal } from "antd";

const Dashboard = () => {
  const { userInfo, userDetail, checkSecret } = useMyContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (checkSecret) {
      navigate("/teams");
    }
  }, [checkSecret]);
  return (
    <>
      {checkSecret ? (
        <></>
      ) : (
        <Modal open={!checkSecret} footer={null} width={600}>
          <SecreteCode />
        </Modal>
      )}
    </>
  );
};

export default Dashboard;
