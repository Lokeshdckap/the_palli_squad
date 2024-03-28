import React, { useState } from "react";
import { set } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../context/AppContext";

export const SideBarComponent = ({ param }) => {
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState(false);
  const { userInfo, userDetail } = useMyContext();

  const handle = (value) => {
    if (value == "open") {
      setAdminList(!adminList);
    } else {
      navigate(`/${value}`);
      setAdminList(false);
    }
  };

  return (
    <div className="bg-slate-950 w-[200px]  h-screen">
      <div>
        <div className="flex gap-4 mx-3 pt-4" >
          <img
            src="https://i.postimg.cc/mDrRnHY3/shield.png"
            alt=""
            className="h-8 text-[#F9EFD4] cursor-pointer"
          />
          <p className="text-white text-[22px] font-semibold" >Vault</p>
        </div>

        <div className="pt-3 w-[180px] m-auto">
          <div
            className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
              window.location.pathname == "/secrets" && "bg-[#7d8285]"
            } `}
            onClick={() => handle("secrets")}
          >
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 ">
              Secrets
            </p>
          </div>
          {/* {userDetail?.role_type === 1 && (
            <div
              className={` w-[100%] m-auto rounded-sm ${
                adminList === "/admin" && ""
              } `}
              onClick={() => handle("open")}
            >
              <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 flex justify-between">
                <span>Administration</span>
                <span>
                  {adminList ? (
                    <i className="fa-solid fa-angle-down text-[#F9EFD4] cursor-pointer pr-2"></i>
                  ) : (
                    <i className="fa-solid fa-angle-right text-[#F9EFD4] cursor-pointer pr-2"></i>
                  )}
                </span>
              </p>
              {adminList && (
                <div
                  className=""
                  style={{
                    borderLeft: "1px solid white",
                    marginLeft: "20px",
                  }}
                >
                  <Link to={"/admin/existingUsers"}>
                    <div
                      className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 my-1 rounded-sm ${
                        window.location.pathname === "/admin/existingUsers" &&
                        "bg-[#7d8285]"
                      } `}
                    >
                      <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                        Existing Users
                      </p>
                    </div>
                  </Link>
                  <Link to={"/admin/pendingList"}>
                    <div
                      className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 mx-1 rounded-sm ${
                        window.location.pathname === "/admin/pendingList" &&
                        "bg-[#7d8285]"
                      } `}
                    >
                      <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                        Pending Authorization
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )} */}
          <div
            className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm ${
              adminList == "/admin" && "bg-[#7d8285]"
            } `}
            onClick={() => handle("open")}
          >
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 flex  justify-between">
              <span>Adminstration</span>
              <span>
                {adminList ? (
                  <i className="fa-solid fa-angle-down text-[#F9EFD4] cursor-pointer pr-2"></i>
                ) : (
                  <i className="fa-solid fa-angle-right text-[#F9EFD4] cursor-pointer pr-2"></i>
                )}
              </span>
            </p>
          </div>
          {adminList && (
            <div
              className=""
              style={{
                borderLeft: "1px solid white",
                marginLeft: "20px",
              }}
            >
              <Link to={"/admin/existingUsers"}>
                <div
                  className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 my-1 rounded-sm ${
                    window.location.pathname == "/admin/existingUsers" &&
                    "bg-[#7d8285]"
                  } `}
                >
                  <p className="text-white text-[16px]  cursor-pointer py-1.5 ">
                    Existing Users
                  </p>
                </div>
              </Link>
              <Link to={"/admin/pendingList"}>
                <div
                  className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 mx-1 rounded-sm ${
                    window.location.pathname == "/admin/pendingList" &&
                    "bg-[#7d8285]"
                  } `}
                >
                  <p className="text-white text-[16px]  cursor-pointer py-1.5 ">
                    Pending Authorization
                  </p>
                </div>
              </Link>
            </div>
          )}{" "}
          {/* </Link> */}
          {/* <Link to={"/teams"}> */}
          <div
            className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
              window.location.pathname == "/teams" && "bg-[#7d8285]"
            } `}
            onClick={() => handle("teams")}
          >
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 ">
              Teams
            </p>
          </div>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};
