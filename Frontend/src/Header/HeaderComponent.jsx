import React, { useEffect, useRef, useState } from "react";
import Search from "../commonComponents/Search";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../context/AppContext";

export const HeaderComponent = () => {
  const { userInfo, userDetail } = useMyContext();

  const profileRef = useRef(null);
  const profileIconRef = useRef(null);

  const [profileState, setProfileState] = useState(false);

  const onLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.reload("/signin");
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (profileState && e.target !== profileIconRef.current) {
        setProfileState(false);
      }
    };

    window.addEventListener("click", closeOnOutsideClick);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [profileState]);

  const handleProfile = () => {
    setProfileState((prevState) => !prevState);
  };
  return (
    <div>
      <div className="flex justify-between px-[30px] py-[18px] bg-slate-900">
        <Search />

        <div onClick={handleProfile}>
          <i
            className="fa-regular text-white fa-circle-user text-2xl cursor-pointer pr-3"
            ref={profileIconRef}
          ></i>
        </div>

        {profileState && (
          <div
            className="bg-white  w-52 absolute top-14 border-[1px] right-[35px] z-30 shadow-md rounded-lg"
            ref={profileRef}
          >
            <div className="w-[85%] m-auto pt-[12px] ">
              <div className="flex justify-center">
                <i className="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-3"></i>
              </div>
              <div className="flex justify-center ">
                <p className="text-[12px] text-textPrimary pt-[2px] pb-[10px]">
                  {""}
                </p>
              </div>
              <hr />
              <div className="flex justify-center ">
                <p className="text-[14px] text-textPrimary pt-[2px] pb-[10px]">
                  {userDetail?.email}
                </p>
              </div>
              <div className="hover:text-primary  pb-[12px]  flex items-center space-x-2">
                <i className="fa-solid fa-arrow-right-from-bracket  text-[16px]  cursor-pointer"></i>

                <p className="text-[16px]   cursor-pointer" onClick={onLogout}>
                  Signout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
