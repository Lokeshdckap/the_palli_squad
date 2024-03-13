import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate, useParams } from "react-router-dom";

const AppContext = createContext();

const MyContextProvider = ({ children }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);


  useEffect(() => {

    userInfo();

  },[])

  const userInfo = async () => {
    await axiosClient
      .get("/api/user/getUserInfo")
      .then((res) => {
        
        setUserDetail(res.data.userInfo);
      
      })
      .catch((err) => {
        const response = err.response;
        console.log(response);
      });
  };
  return (
    <AppContext.Provider
      value={{
        userDetail,
        userInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useMyContext = () => {
  return useContext(AppContext);
};

export { MyContextProvider, useMyContext };
