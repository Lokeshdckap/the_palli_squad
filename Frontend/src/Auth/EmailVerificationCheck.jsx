import React, { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export const EmailVerificationCheck = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useStateContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (params.uuid && params.token) {
      axiosClient
        .get(`/api/auth/verify-email/${params.uuid}/${params.token}`)
        .then((res) => {
          if (res.data.status == 200) {
            navigate("/signin");
          }

          setLoading(false);
        })

        .catch((err) => {
          console.error("Axios error:", err);

          const response = err.response;
          if (response && response?.status === 409) {
            navigate("/signin");
          } else {
            console.error("Error:", response?.status);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [params.uuid, params.token]);

  return (
    <div>
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
  );
};
