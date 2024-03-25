import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import GuestLayout from "./Authorisation/GuestLayout";
import DefaultLayout from "./Authorisation/DefaultLayout";
import Signup from "./Auth/Signup";
import Signin from "./Auth/Signin";
import Dashboard from "./Dashboard/Dashboard";
import Error from "./Error/Error";
import EmailVerification from "./Auth/EmailVerification";
import { EmailVerificationCheck } from "./Auth/EmailVerificationCheck";
import { Admin } from "./Admin/Admin";
import { Users } from "./Users/Users";
import { Teams } from "./Teams/Teams";
import { Secrets } from "./Secret/Secrets";

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
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/secrets/:uuid?",
        element: <Secrets />,
      },
      {
        path: "/admin/existingUsers",
        element: <Admin />,
      },
      {
        path: "/admin/pendingList",
        element: <Admin />,
        
      },
      
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
      {
        path: "/emailverify",
        element: <EmailVerification />,
      },
      {
        path: "/email-verify/:uuid/:token",
        element: <EmailVerificationCheck />,

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
