import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate, useParams } from "react-router-dom";

const AppContext = createContext();

const MyContextProvider = ({ children }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);

  const [role, setRole] = useState(null);

  const[checkSecret,setCheckSecret]=useState(false)

  useEffect(() => {

    userInfo();

  },[])

  const getTeam = async () => {
    // setLoading(true);
    if (params.uuid) {
      await axiosClient
        .get(`/api/teams/getTeam/${params.uuid}`)
        .then((res) => {
          // setLoading(false);
          setRole(res.data.team_member.role_id);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response?.status === 404) {
            navigate("/error");
          }
          console.log(err);
          // setLoading(false);
        });
    }
  };

  const userInfo = async () => {
    await axiosClient
      .get("/api/user/getUserInfo")
      .then((res) => {
        
        setUserDetail(res.data.userInfo);
        setCheckSecret(res.data.is_secretCode)
      
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
        role,
        getTeam,
        checkSecret,
        setCheckSecret
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
