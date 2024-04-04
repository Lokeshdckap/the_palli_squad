import React, { useEffect } from "react";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import { useMyContext } from "../context/AppContext";
import SecreteCode from "../Auth/Login/SecretCode";

const Dashboard = () => {
  const { userInfo, userDetail,checkSecret} = useMyContext();
  
const navigate = useNavigate();
  useEffect(() => {
    if(checkSecret){
    navigate("/teams");
    }
  }, []);
  return (
    <>
       {checkSecret ? <></> : <SecreteCode/>}
    </>
  );
};

export default Dashboard;
