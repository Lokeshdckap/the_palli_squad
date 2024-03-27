import { Link, Navigate, Outlet, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useEffect } from "react";
import { SideBar } from "../SideBar/SideBar.jsx";
import { MyContextProvider } from "../context/AppContext.jsx";

export default function DefaultLayout() {
  const { auth, setAuth } = useStateContext();
  const param = useParams();

  // if (!auth) {
  //   return <Navigate to="/signin" />;
  // } else {
    return (
      <MyContextProvider>
        <div className="flex">
          <SideBar param={param} />
          <div
            className="bg-[#313a3f]  h-[70px]"
            style={{ width: "calc(100% - 180px)" }}
          >
            <Outlet />
          </div>
        </div>
      </MyContextProvider>
    );
  // }
}
