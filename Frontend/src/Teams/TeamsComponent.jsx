import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import TeamTableComponent from "../commonComponents/TeamTableComponent";
import TeamName from "./TeamName";
import InviteUsers from "./InviteUsers";
import CreateTeamForm from "./CreateTeamForm";
import axiosClient from "../axios-client";

const TeamsComponent = (props) => {
  const [teamList, setTeamList] = useState([]);
  const [teampop, setTeampop] = useState(false);
  const [closeTab, setCloseTab] = useState(false);
  const [teamCreateForm, setTeamCreateForm] = useState("");

  const handleOpenClose = () => {
    setCloseTab(false);
  };
  const handleTeamForm = () => {
    setTeamCreateForm(false);
  };

  useEffect(() => {
    setTeampop(true);
    getAllTeam();
  }, []);

  const getAllTeam = () => {
    axiosClient
      .get("/api/teams/getAllTeam")
      .then((res) => {
        setTeamList(res.data.getAllTeam);

        setTeampop(false);
      })
      .catch((error) => {
        setTeampop(false);
      });
  };
  // console.log(teamList)
  return (
    <div>
      {!teampop ? (
        <div>
          <Header />
          {/* <InviteUsers closeTab={closeTab} setCloseTab={setCloseTab} handleOpenClose={handleOpenClose} /> */}
          <CreateTeamForm teamCreateForm={teamCreateForm} setTeamCreateForm={setTeamCreateForm} handleTeamForm={handleTeamForm} />
          <TeamName />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default TeamsComponent;
