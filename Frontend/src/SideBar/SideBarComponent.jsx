import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../context/AppContext";
import groupicon from "../assets/images/group.png";
import groupsecret from "../assets/images/groupicon.png";
import mysecret from "../assets/images/mysecret.png";
import padlock from "../assets/images/padlock.png";
import sharedicon from "../assets/images/confidential-email.png";
import pendinguseIcon from "../assets/images/pendinguser.png";
import authorisedPeople from "../assets/images/authorised-people.png";
import adminicon from "../assets/images/adminicon.png";

export const SideBarComponent = ({ param }) => {
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);

  const { userDetail } = useMyContext();

  const handle = (value) => {
    if (value === "adminOpen") {
      setAdminList(!adminList);
    } else if (value === "secret_open") {
      setSecretOpen(!secretOpen);
    } else {
      navigate(`/${value}`);
      setAdminList(false);
    }
  };

  return (
    <div className="bg-slate-950 w-[200px]  h-screen select-none">
      <div>
        <div className="flex items-center gap-4 mx-3 pt-4">
          <img
            src="https://i.postimg.cc/mDrRnHY3/shield.png"
            alt=""
            className="h-10 text-[#F9EFD4] cursor-pointer"
          />
          <div>
            <p className="text-white text-[18px] font-semibold ">DCKAP</p>
            <p className="text-white text-[14px] font-medium">Vault</p>
          </div>
        </div>

        <div className="pt-3 w-[180px] m-auto">
          {/* <div
            className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
              window.location.pathname == "/secrets" && "bg-[#7d8285]"
            } `}
            onClick={() => handle("secrets")}
          >
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 ">
              Secrets
            </p>
          </div> */}

          <div
            className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
              window.location.pathname == "/teams" && "bg-[#7d8285]"
            } `}
            onClick={() => handle("teams")}
          >
            <div className="flex items-center gap-3 py-1.5 pl-2">
              <img src={groupicon} alt="" className="h-5" />
              <p className="text-white text-[18px] cursor-pointer">Teams</p>
            </div>
          </div>

          <div
            className={` w-[100%] m-auto rounded-sm`}
            onClick={() => handle("secret_open")}
          >
            <div className="flex items-center gap-3 py-1.5 pl-1.5">
              <img src={padlock} alt="" className="h-5 w-6" />
              <p className="text-white cursor-pointer flex gap-3 items-center">
                <span className="text-[18px]">Secrets</span>
                <span>
                  {secretOpen ? (
                    <i className="fa-solid fa-angle-down text-[#F9EFD4] cursor-pointer"></i>
                  ) : (
                    <i className="fa-solid fa-angle-right text-[#F9EFD4] cursor-pointer"></i>
                  )}
                </span>
              </p>
            </div>

            {secretOpen && (
              <div
                className=""
                style={{
                  borderLeft: "1px solid white",
                  marginLeft: "20px",
                }}
              >
                <Link
                  to={"/secrets/mysecrets/"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 my-1 rounded-sm ${
                      window.location.pathname === "/secrets/mysecrets/" &&
                      "bg-[#7d8285]"
                    } `}
                  >
                    <div className="flex items-center gap-2 pl-1">
                      <img src={mysecret} alt="" className="h-5" />
                      <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                        My Secrets
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  to={"/secrets/teamsecrets/"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 mx-1 rounded-sm ${
                      window.location.pathname === "/secrets/teamsecrets/" &&
                      "bg-[#7d8285]"
                    } `}
                  >
                    <div className="flex items-center gap-2">
                      <img src={groupsecret} alt="" className="h-5" />
                      <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                        Team Secrets
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  to={"/secrets/sharewithme"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`hover:bg-[#7d8285] w-[100%] m-auto pl-5 mx-1 rounded-sm ${
                      window.location.pathname === "/secrets/sharewithme/" &&
                      "bg-[#7d8285]"
                    } `}
                  >
                    <div className="flex items-center gap-2 mt-1">
                      <img src={sharedicon} alt="" className="h-5" />
                      <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                        Share with me
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {userDetail?.role_type === 1 && (
            <div
              className={` w-[100%] m-auto rounded-sm ${
                adminList === "/admin" && ""
              } `}
              onClick={() => handle("adminOpen")}
            >
              <div className="flex items-center gap-2 py-2 pl-1.5">
                <img src={adminicon} alt="" className="h-6 w-6" />
                <p className="text-white text-[18px] cursor-pointer flex gap-2">
                  <span>Administration</span>
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
                  <Link
                    to={"/admin/existingUsers"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`hover:bg-[#7d8285] w-[100%] m-auto pl-3 my-1 rounded-sm ${
                        window.location.pathname === "/admin/existingUsers" &&
                        "bg-[#7d8285]"
                      } `}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={authorisedPeople}
                          alt=""
                          className="h-6 w-6"
                        />
                        <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                          Existing Users
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={"/admin/pendingList"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`hover:bg-[#7d8285] w-[100%] m-auto pl-3 mx-1 rounded-sm ${
                        window.location.pathname === "/admin/pendingList" &&
                        "bg-[#7d8285]"
                      } `}
                    >
                      <div className="flex items-center gap-2 py-1.5">
                        <img src={pendinguseIcon} alt="" className="h-5 w-5" />
                        <p className="text-white text-[16px] cursor-pointer">
                          Pending Authorization
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
