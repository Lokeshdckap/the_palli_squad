import React, { useEffect } from "react";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import { useMyContext } from "../context/AppContext";

const Dashboard = () => {
  const { userInfo, userDetail } = useMyContext();

    console.log(userInfo);
  
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/teams");
  }, []);
  return (
    <>
      {/* <SideBar /> */}
      {/* <Header /> */}
    </>
  );
};

export default Dashboard;
