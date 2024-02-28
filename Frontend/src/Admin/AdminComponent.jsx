import React from "react";
import { Header } from "../Header/Header";
import { useParams } from "react-router-dom";

export const AdminComponent = () => {
  const param = useParams();
  return (
    <div>
      <Header param={param} />
      <div>Admin</div>
    </div>
  );
};
