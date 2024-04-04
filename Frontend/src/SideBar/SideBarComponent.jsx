import React, { useState } from "react";
import { set } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../context/AppContext";

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
    <div className="bg-slate-950 w-[200px]  h-screen">
      <div>
        <div className="flex gap-4 mx-3 pt-4">
          <img
            src="https://i.postimg.cc/mDrRnHY3/shield.png"
            alt=""
            className="h-8 text-[#F9EFD4] cursor-pointer"
          />
          <p className="text-white text-[22px] font-semibold">Vault</p>
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
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 ">
              Teams
            </p>
          </div>

          <div
            className={` w-[100%] m-auto rounded-sm`}
            onClick={() => handle("secret_open")}
          >
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 flex justify-between">
              <span>Secrets</span>
              <span>
                {secretOpen ? (
                  <i className="fa-solid fa-angle-down text-[#F9EFD4] cursor-pointer pr-2"></i>
                ) : (
                  <i className="fa-solid fa-angle-right text-[#F9EFD4] cursor-pointer pr-2"></i>
                )}
              </span>
            </p>

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
                    <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                      My Secrets
                    </p>
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
                    <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                      Team Secrets
                    </p>
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
                    <p className="text-white text-[16px] cursor-pointer py-1.5 ">
                      Share with me
                    </p>
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
                  <Link
                    to={"/admin/existingUsers"}
                    onClick={(e) => e.stopPropagation()}
                  >
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
                  <Link
                    to={"/admin/pendingList"}
                    onClick={(e) => e.stopPropagation()}
                  >
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
          )}
        </div>
      </div>
    </div>
  );
};
