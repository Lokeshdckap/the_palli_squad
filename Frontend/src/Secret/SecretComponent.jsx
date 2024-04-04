import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { useParams } from "react-router-dom";
import { MySecretComponent } from "./MySecrets/MySecretComponent";
import { TeamSecretComponent } from "./Teams/TeamSecretComponent";
import { ShareSecretComponent } from "./ShareWithMe/ShareSecretComponent";

export const SecretComponent = () => {
  const param = useParams();

  return (
    <div>
    <Header param={param} />
    <div>
      {window.location.pathname === "/secrets/mysecrets" ? (
        <MySecretComponent />
      ) : window.location.pathname === "/secrets/teamsecrets" ? (
        <TeamSecretComponent />
      ) : (
        <ShareSecretComponent />
      )}
    </div>
  </div>
  );
};
