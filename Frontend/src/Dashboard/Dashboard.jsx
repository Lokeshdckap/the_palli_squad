import React, { useEffect } from "react";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  useEffect(() =>{
    navigate("/admin")
  },[])
  return (
    <>
      {/* <SideBar /> */}
      {/* <Header /> */}
    </>
  );
};

export default Dashboard;
