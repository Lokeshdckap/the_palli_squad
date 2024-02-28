import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const SideBarComponent = ({ param }) => {



  const navigate = useNavigate()
  const [adminList, setAdminList] = useState(false);


  const navigating = (value) =>{
    alert(value);

    navigate(`/${value}`)
  }


  return (
    <div className="bg-black w-[200px]  h-screen">
      <div>
        <div>
          <img
            src={"https://i.postimg.cc/W11rypJ7/book-3.png"}
            alt=""
            className="h-6 text-[#F9EFD4] cursor-pointer"
          />
        </div>

        <div className="pt-12 w-[180px] m-auto">
          {/* <Link to={"/secrets"}> */}
            <div
              className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
                window.location.pathname == "/secrets" && "bg-[#7d8285]"
              } `}
              onClick={navigating("secrets")}
            >
              <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 ">
                Secrets
              </p>
            </div>
          {/* </Link> */}
          {/* <Link to={"/admin"}> */}
          <div
            className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm ${
              adminList == "/admin" && "bg-[#7d8285]"
            } `}
            onClick={() => setAdminList(true)}
          >
            <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 flex  justify-between">
              <span>Adminstration</span>
              <span>
                <i className="fa-solid fa-angle-down text-[#F9EFD4] cursor-pointer pr-2"></i>
              </span>
            </p>
          </div>
          {/* </Link> */}
          {adminList && (
            <div
              className=""
              style={{
                borderLeft: "1px solid white",
                marginLeft: "25px",
              }}
            >
              <div className=" w-[100%] pl-5 m-auto rounded-sm my-2 ">
                <p className="text-white text-[16px]  cursor-pointer py-1.5 ">
                  Existing Users
                </p>
              </div>
              <div className=" w-[100%] pl-5 m-auto rounded-sm my-2 ">
                <p className="text-white text-[16px]  cursor-pointer py-1.5 ">
                  Pending Authorization
                </p>
              </div>
            </div>
          )}
          {/* <Link to={"/users"}> */}
            <div
              className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
                window.location.pathname == "/users" && "bg-[#7d8285]"
              } `}
              onClick={navigating("users")}

            >
              <p className="text-white text-[18px] pl-3 cursor-pointer py-1.5 ">
                Users
              </p>
            </div>
          {/* </Link> */}
          {/* <Link to={"/teams"}> */}
            <div
              className={`hover:bg-[#7d8285] w-[100%] m-auto rounded-sm my-2 ${
                window.location.pathname == "/teams" && "bg-[#7d8285]"
              } `}
              onClick={navigating("teams")}

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
