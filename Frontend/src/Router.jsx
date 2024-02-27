import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import GuestLayout from "./Authorisation/GuestLayout";
import DefaultLayout from "./Authorisation/DefaultLayout";
import Signup from "./Auth/Signup";
import Signin from "./Auth/Signin";
import Dashboard from "./Dashboard/Dashboard";
import Error from "./Error/Error";

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={`/dashboard`} />,
      },

      {
        path: "/dashboard/",
        element: <Dashboard />,
      }     
    ],
  },


  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    //   {
    //     path: "/forgotpassword",
    //     element: <ForgotPassword />,
    //   },
    //   {
    //     path: "/changepassword/:uuid/:token",
    //     element: <ChangePassword />,
    //   },
    //   {
    //     path: "/emailverify",
    //     element: <EmailVerification />,
    //   },
    //   {
    //     path: "/email-verify/:uuid/:token",
    //     element: <EmailVerificationCheck />,
    //   },
   
      // {
      //   path: "/email-verify/:uuid/:token",
      //   element: <SignupContainer />,
      // },
    ],
  },

  
  {
    path: "*",
    element: <Error />,
  },
  
]);

export default router;
